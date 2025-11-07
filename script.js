document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('search');
    let talks = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            talks = data.talks;
            renderSchedule(talks);
        });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let startTime = new Date('2025-11-07T10:00:00');

        talksToRender.forEach((talk, index) => {
            if (index === 3) {
                const lunchBreak = document.createElement('div');
                lunchBreak.className = 'break';
                const lunchStart = new Date(startTime.getTime());
                const lunchEnd = new Date(lunchStart.getTime() + 60 * 60 * 1000);
                lunchBreak.innerHTML = `Lunch Break: ${formatTime(lunchStart)} - ${formatTime(lunchEnd)}`;
                scheduleContainer.appendChild(lunchBreak);
                startTime = lunchEnd;
            }

            const talkElement = document.createElement('div');
            talkElement.className = 'talk';

            const talkStart = new Date(startTime.getTime());
            const talkEnd = new Date(talkStart.getTime() + 60 * 60 * 1000);

            talkElement.innerHTML = `
                <div class="time">${formatTime(talkStart)} - ${formatTime(talkEnd)}</div>
                <h2>${talk.title}</h2>
                <div class="speakers">${talk.speakers.join(', ')}</div>
                <div class="categories">${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}</div>
                <p>${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkElement);

            startTime = new Date(talkEnd.getTime() + 10 * 60 * 1000); // 10 minute break
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
