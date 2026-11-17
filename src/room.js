import * as THREE from 'three';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';

// Browser presentation of the actual local MVP photographic reconstruction.
// Source: HEIG-VD Geomatics, CC BY 4.0. Reconstruction/refinement: MemorX.
// Uses the identical PLY and raw-to-world matrix as the MVP screenshot capture.
const ORIGIN = new THREE.Vector3(0.225, 1.62, 4.275);
const LOOK = new THREE.Vector3(0.31067507027, 1.67368656064, 3.21095384334);
const PIN = new THREE.Vector3(1.11061801936, 2.17495473013, -6.72398076306);
const TRANSFORM = [-1.0544662305167292,-0.039042066243886044,-0.17027440715887368,-0.04688758940107301,0.010887607473672357,-1.0544662305167292,0.17435342461046507,1.6486123329277629,-0.17435342461046507,0.17027440715887368,1.0406844851170574,-0.4585610497033964,0,0,0,1];
let current;

function status(text) {
  const node = document.getElementById('room-status');
  if (node) node.textContent = text;
}

function mount(container) {
  if (typeof container === 'string') container = document.querySelector(container);
  if (!container) return Promise.reject(new Error('Room canvas container not found.'));
  if (current && current.container === container) { resume(); return current.ready; }
  dispose();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#151716');
  const camera = new THREE.PerspectiveCamera(62, 1, 0.025, 120);
  camera.rotation.order = 'YXZ';
  camera.position.copy(ORIGIN);
  camera.lookAt(LOOK);
  const homeEuler = camera.rotation.clone();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
  } catch (error) {
    status('3D is unavailable here. Use the product screenshot to continue.');
    window.dispatchEvent(new CustomEvent('room-error', { detail: { message: 'WebGL is unavailable.' } }));
    return Promise.reject(error);
  }

  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'MemorX classroom. Drag to look. Use arrow keys to move. Escape returns focus to presentation.');
  Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab', outlineOffset: '-4px' });
  container.appendChild(canvas);

  let resolveReady, rejectReady;
  const state = current = {
    container, scene, camera, renderer, canvas, model: null, spark: null, splat: null,
    active: true, visible: true, loaded: false, disposed: false, frame: 0,
    destination: ORIGIN.clone(), cleanup: [],
    ready: new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; })
  };
  // The caller can listen for room-error; also attach a handler to avoid an
  // unhandled rejection when a click handler deliberately ignores the Promise.
  state.ready.catch(() => {});
  const listen = (node, name, fn, opts) => {
    node.addEventListener(name, fn, opts);
    state.cleanup.push(() => node.removeEventListener(name, fn, opts));
  };

  function updatePin() {
    const pin = document.getElementById('memory-pin');
    if (!pin || !pin.hasAttribute('data-world-pin')) return;
    const point = PIN.clone().project(camera);
    const inFrame = point.z > -1 && point.z < 1 && Math.abs(point.x) < 0.92 && Math.abs(point.y) < 0.92;
    pin.style.visibility = inFrame ? 'visible' : 'hidden';
    pin.style.left = `${(point.x + 1) * 50}%`;
    pin.style.top = `${(1 - point.y) * 50}%`;
  }

  function render() {
    state.frame = 0;
    if (state.disposed || !state.active || !state.visible || document.hidden) return;
    const remaining = camera.position.distanceTo(state.destination);
    if (remaining > 0.001) camera.position.lerp(state.destination, 0.18);
    else camera.position.copy(state.destination);
    if (state.spark) {
      const physical = renderer.getDrawingBufferSize(new THREE.Vector2());
      const fx = Math.abs(camera.projectionMatrix.elements[0]) * physical.x * 0.5;
      const fy = Math.abs(camera.projectionMatrix.elements[5]) * physical.y * 0.5;
      const ratio = THREE.MathUtils.clamp(Math.sqrt(fx * fy) / 500.85539134152555, 0.25, 4);
      // Match the MVP's Brush-classic resolution-aware covariance floor.
      // Spark's default compensated blur would visibly thin this reconstruction.
      state.spark.preBlurAmount = 0.3 * ratio * ratio;
      state.spark.blurAmount = 0;
    }
    renderer.render(scene, camera);
    updatePin();
    // Sorting and worker-upload completion require frames even while the camera
    // is still. Rendering stops completely on pause, offscreen or hidden tab.
    if (state.spark || remaining > 0.001) request();
  }
  function request() {
    if (!state.frame && state.active && state.visible && !state.disposed && !document.hidden) state.frame = requestAnimationFrame(render);
  }
  state.request = request;
  function resize() {
    const width = container.clientWidth, height = container.clientHeight;
    if (width > 0 && height > 0) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      request();
    }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  state.cleanup.push(() => resizeObserver.disconnect());
  const intersection = new IntersectionObserver(entries => {
    state.visible = entries[0]?.isIntersecting ?? false;
    if (state.visible) { resize(); request(); }
    else { cancelAnimationFrame(state.frame); state.frame = 0; }
  });
  intersection.observe(container);
  state.cleanup.push(() => intersection.disconnect());
  listen(document, 'visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(state.frame); state.frame = 0; }
    else request();
  });
  resize();

  function action(which) {
    if (!state.loaded || state.disposed || !state.active) return;
    if (which === 'reset') {
      camera.position.copy(ORIGIN); state.destination.copy(ORIGIN); camera.rotation.copy(homeEuler);
    } else {
      const direction = new THREE.Vector3(); camera.getWorldDirection(direction); direction.y = 0; direction.normalize();
      const right = direction.clone().cross(camera.up).normalize();
      const step = 0.48;
      if (which === 'forward') state.destination.addScaledVector(direction, step);
      if (which === 'back') state.destination.addScaledVector(direction, -step);
      if (which === 'right') state.destination.addScaledVector(right, step);
      if (which === 'left') state.destination.addScaledVector(right, -step);
      // Estimated scene envelope; this lightweight deck has no collision engine.
      state.destination.x = THREE.MathUtils.clamp(state.destination.x, -5.3, 4.3);
      state.destination.z = THREE.MathUtils.clamp(state.destination.z, -6.6, 6.4);
      state.destination.y = 1.62;
    }
    request();
  }
  state.action = action;
  listen(document, 'click', event => {
    const button = event.target.closest?.('[data-room-action]');
    if (button) action(button.dataset.roomAction);
  });
  let drag;
  listen(canvas, 'pointerdown', event => {
    if (event.button !== 0) return;
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    drag = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = 'grabbing';
  });
  listen(canvas, 'pointermove', event => {
    if (!drag || !state.active) return;
    camera.rotation.y -= (event.clientX - drag.x) * 0.003;
    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - (event.clientY - drag.y) * 0.003, -1.1, 1.1);
    drag = { x: event.clientX, y: event.clientY };
    request();
  });
  function endDrag() { drag = null; canvas.style.cursor = 'grab'; }
  listen(canvas, 'pointerup', endDrag);
  listen(canvas, 'pointercancel', endDrag);
  listen(canvas, 'lostpointercapture', endDrag);
  listen(canvas, 'keydown', event => {
    const command = { ArrowUp: 'forward', ArrowDown: 'back', ArrowLeft: 'left', ArrowRight: 'right', w: 'forward', s: 'back', a: 'left', d: 'right', Home: 'reset' }[event.key];
    if (command) { event.preventDefault(); event.stopPropagation(); action(command); }
    if (event.key === 'Escape') { canvas.blur(); event.stopPropagation(); }
  });
  listen(canvas, 'webglcontextlost', event => {
    event.preventDefault(); pause(); status('3D paused. Reload this deck or continue with the screenshot.');
    window.dispatchEvent(new CustomEvent('room-error', { detail: { message: 'WebGL context lost.' } }));
  });

  status('Opening the actual photographic reconstruction · 82.6 MB');
  const modelUrl = new URL('assets/room.ply', document.baseURI).href;
  try {
    state.spark = new SparkRenderer({ renderer });
    scene.add(state.spark);
    const capture = new THREE.Group();
    capture.matrixAutoUpdate = false;
    capture.matrix.fromArray(TRANSFORM).transpose();
    const splat = new SplatMesh({
      url: modelUrl,
      raycastable: false,
      onProgress: event => {
        if (state.disposed) return;
        const loaded = (event.loaded / 1000000).toFixed(1);
        const total = ((event.total || 82625151) / 1000000).toFixed(1);
        status(event.loaded >= (event.total || 82625151)
          ? 'Preparing photographic detail…'
          : `Loading photographic detail · ${loaded} / ${total} MB`);
      }
    });
    state.splat = splat;
    capture.add(splat); state.model = capture; scene.add(capture);
    resize(); request();
    splat.initialized.then(() => {
      if (state.disposed) return;
      state.loaded = true;
      status('Actual MVP reconstruction · Includes inferred surfaces · Drag to look');
      request();
      resolveReady({ loaded: true });
      window.dispatchEvent(new CustomEvent('room-ready', { detail: { representation: 'Gaussian splat', sourcePhotographs: 70 } }));
    }).catch(fail);
  } catch (error) { fail(error); }
  function fail(error) {
    if (state.disposed) return;
    pause();
    status('Photographic 3D could not open. Continue with the screenshot, or try a WebGL2 browser.');
    window.dispatchEvent(new CustomEvent('room-error', { detail: { message: 'Photographic room asset failed to load.' } }));
    rejectReady(error);
  }
  return state.ready;
}

function free(object) {
  const textures = new Set();
  object?.traverse(item => {
    if (!item.isMesh) return;
    item.geometry?.dispose();
    for (const material of (Array.isArray(item.material) ? item.material : [item.material])) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    }
  });
  textures.forEach(texture => texture.dispose());
}
function pause() {
  if (!current) return;
  current.active = false; cancelAnimationFrame(current.frame); current.frame = 0;
}
function resume() {
  if (!current) return;
  current.active = true; current.request();
}
function dispose() {
  if (!current) return;
  const state = current; current = null; state.disposed = true;
  cancelAnimationFrame(state.frame); state.cleanup.forEach(fn => fn());
  state.splat?.dispose(); state.spark?.dispose();
  state.renderer.dispose(); state.canvas.remove();
}
window.MemorXRoom = { mount, pause, resume, dispose, action: command => current?.action(command) };
