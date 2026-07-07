let myChart = null;

function calcularMercado() {
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const tam = (parseFloat(document.getElementById('tamClientes').value) || 0) * precio;
    const sam = (parseFloat(document.getElementById('samClientes').value) || 0) * precio;
    const som = (parseFloat(document.getElementById('somClientes').value) || 0) * precio;

    // Mostrar texto descriptivo
    document.getElementById('resultadosTexto').innerHTML = `
        <p><strong>TAM (Mercado Total):</strong> $${tam.toLocaleString()}</p>
        <p><strong>SAM (Mercado Disponible):</strong> $${sam.toLocaleString()}</p>
        <p><strong>SOM (Mercado Objetivo):</strong> $${som.toLocaleString()}</p>
    `;

    // Dibujar o actualizar gráfico
    const ctx = document.getElementById('marketChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['TAM', 'SAM', 'SOM'],
            datasets: [{
                label: 'Tamaño de Mercado ($)',
                data: [tam, sam, som],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if (!input.value.trim()) return;

    // Mensaje del usuario
    chatBox.innerHTML += `<p class="text-blue-600"><strong>Tú:</strong> ${input.value}</p>`;
    
    // Simulación de respuesta del bot (Para no exponer tu API Key de OpenAI en el frontend de Github)
    setTimeout(() => {
        chatBox.innerHTML += `<p class="text-gray-800"><strong>Bot:</strong> Para ese mercado, te recomiendo consultar bases de datos públicas como el <strong>INEGI / Statista</strong>, o usar herramientas como <strong>SEMrush</strong> para ver cuánta gente busca tu producto en internet.</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Ejecutar cálculo inicial al cargar la página
window.onload = calcularMercado;