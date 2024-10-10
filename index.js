 // Crear la red neuronal (configuración de ejemplo)
const net = new brain.NeuralNetwork({
    inputSize: 784,          // 28x28 = 784 píxeles como entrada
    hiddenLayers: [64, 32],  // Capas ocultas con 64 y 32 neuronas
    outputSize: 1            // Salida binaria (perro o muffin)
});

// Simular un conjunto de entrenamiento más variado
net.train([
    { input: Array(784).fill(0.1), output: [0] },  // Simulación de "perro"
    { input: Array(784).fill(0.2), output: [0] },  // Simulación de "perro"
    { input: Array(784).fill(0.9), output: [1] },  // Simulación de "muffin"
    { input: Array(784).fill(0.8), output: [1] },  // Simulación de "muffin"
    { input: Array(784).fill(0.3), output: [0] },  // Simulación de "perro"
    { input: Array(784).fill(0.7), output: [1] },  // Simulación de "muffin"
]);

// Obtener los elementos de la página
const uploadedImageElement = document.getElementById('uploadedImage');
const resultadoElement = document.getElementById('resultado');

// Al subir la imagen
document.getElementById('upload').addEventListener('change', (event) => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            // Mostrar la imagen en la página
            uploadedImageElement.src = e.target.result;

            // Dibujar la imagen en el canvas para extraer los píxeles
            ctx.drawImage(img, 0, 0, 28, 28); // Redimensionar la imagen a 28x28

            // Extraer datos de los píxeles
            const imageData = ctx.getImageData(0, 0, 28, 28).data;
            const pixels = [];

            for (let i = 0; i < imageData.length; i += 4) {
                // Convertir cada píxel (R,G,B) en un valor entre 0 y 1 (promedio de los canales RGB)
                const grayscale = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
                const normalizedPixel = grayscale / 255;  // Normalizar el valor entre 0 y 1
                pixels.push(normalizedPixel);
            }

            // Ahora pasamos los píxeles a la red neuronal para hacer la predicción
            const output = net.run(pixels);  // Pasa los 784 píxeles
            const resultado = output > 0.5 ? 'Es un Muffin' : 'Es un Perro';
            console.log("Resultado:", resultado)
            // Mostrar el resultado en la pantalla
            resultadoElement.textContent = resultado;
        }
    }

    reader.readAsDataURL(file);
});