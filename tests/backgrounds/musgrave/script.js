const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function noise(x, y) {
    let total = 0;
    let n = 1;
    for (let i = 0; i < 4; i++) {
        const frequency = Math.pow(2, i);
        const amplitude = Math.pow(0.5, i);
        total += perlin(x * frequency, y * frequency) * amplitude;
        n *= 2;
    }
    return (total / n) + 0.5;
}

function perlin(x, y) {
    const x0 = Math.floor(x), y0 = Math.floor(y),
          x1 = x0 + 1, y1 = y0 + 1,
          sx = x - x0, sy = y - y0;

    const n00 = gradient(Math.random(), Math.random()),
          n10 = gradient(Math.random(), Math.random()),
          n01 = gradient(Math.random(), Math.random()),
          n11 = gradient(Math.random(), Math.random());

    const u = smoothstep(sx),
         v = smoothstep(sy);

    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
}

function gradient(hash) {
    const h = hash * 3621969;
    const x = Math.sin(h).toString().substr(-5),
          y = Math.cos(h).toString().substr(-5);
    return (x + y) / 2;
}

function smoothstep(t) {
    return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function drawMusgraveBackground() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = imgData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const n = noise(x / 200, y / 200) * 256;
            const r = Math.floor(n);
            const g = Math.floor(n * 0.7);
            const b = Math.floor(n * 0.3);

            data[(y * canvas.width + x) * 4]     = r; // Red
            data[(y * canvas.width + x) * 4 + 1] = g; // Green
            data[(y * canvas.width + x) * 4 + 2] = b; // Blue
            data[(y * canvas.width + x) * 4 + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

drawMusgraveBackground();

// Optionally add some borders
ctx.strokeStyle = 'red';
ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1);

ctx.strokeStyle = 'green';
ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

ctx.strokeStyle = 'blue';
ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);
