document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('habitoForm');
    const activeAlarmDiv = document.getElementById('activeAlarm');

    let habitos = [];

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const alarmTime = document.getElementById('alarmTime').value;
        const alarmName = document.getElementById('alarmName').value;
        const endTime = document.getElementById('endTime').value;

        const habito = {
            id: new Date().getTime(),
            alarmTime,
            alarmName,
            endTime,
            startDate: new Date(),
            timestamp:  Date.now(),
        };

        habitos.push(habito);
        saveHabitos();
        renderActiveAlarm(habito);
    });

    function saveHabitos() {
        localStorage.setItem('habitos', JSON.stringify(habitos));
    }

    function loadHabitos() {
        const savedHabitos = localStorage.getItem('habitos');
        if (savedHabitos) {
            habitos = JSON.parse(savedHabitos);
            habitos.forEach(habito => {
                scheduleAlarm(habito);
                renderActiveAlarm(habito);
            });
        }
    }

    function renderActiveAlarm(habito) {
        const alarmElement = document.createElement('div');
        alarmElement.innerHTML = `
            <h3>${habito.alarmName}</h3>
            ${calculateRange(habito.timestamp)}
            <p>Alarma a las: ${habito.alarmTime}</p>
            <p>Finaliza en: ${habito.endTime}</p>
            `;
            // <button onclick="startAlarm('${habito.alarmName}')">Empezar</button>
            // <button onclick="postponeAlarm('${habito.alarmName}')">Aún no</button>
        activeAlarmDiv.appendChild(alarmElement);
    }

    function startAlarm(habitoId) {
        const habito = habitos.find(h => h.id === parseInt(habitoId));

        // Cancelamos la alarma
        cordova.plugins.notification.local.cancel(habitoId, function() {
            alert(`Alarma ${habito.alarmName} comenzada`);
            // Aquí deberías implementar la lógica del temporizador
        });
    }
    function scheduleAlarm(habito) {
        const [hour, minute] = habito.alarmTime.split(':').map(Number);
        const alarmTime = new Date();
        alarmTime.setHours(hour, minute, 0, 0);

        cordova.plugins.notification.local.schedule({
            id: habito.id,
            title: "¡Es hora!",
            text: `Alarma para: ${habito.alarmName}`,
            trigger: { every: { hour, minute }, count: 1 },
            foreground: true, // Muestra la notificación aunque la aplicación esté abierta
        });
    }
    function postponeAlarm(habitoId) {
        const habito = habitos.find(h => h.id === parseInt(habitoId));

        const [hour, minute] = habito.alarmTime.split(':').map(Number);
        const newAlarmTime = new Date();
        newAlarmTime.setHours(hour, minute + 5, 0, 0); // Pospone 5 minutos

        cordova.plugins.notification.local.update({
            id: habito.id,
            title: "¡Es hora!",
            text: `Alarma para: ${habito.alarmName}`,
            trigger: { at: newAlarmTime },
            foreground: true,
        });

        alert(`Alarma ${habito.alarmName} postergada 5 minutos`);
    }
    loadHabitos();

    function calculateRange(startDate) {
        const dayCount = Math.floor((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24));
        range = '';
        if (dayCount <= 20)  range = 'Noob';
        if (dayCount >= 21)  range = 'Pro';
        if (dayCount >= 66)  range = 'Star';
        if (dayCount > 66)   range = 'Hellstar';
        return `<p>Rango: ${range} </p><p>dias: ${dayCount} </p>`
    }
    
});
