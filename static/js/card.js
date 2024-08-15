// Глобальные переменные
let startX, startY, currentX, currentY;
let isSwiping = false;
let swipeEnabled = true;
let profiles = [];
let currentIndex = 0;

// Функция для загрузки профилей
function loadProfiles() {
    profiles = [
        {
            id: 1,
            name: "Диана",
            age: 20,
            image: "https://via.placeholder.com/800x600",
            about: "Люблю путешествовать и читать книги.",
            interests: ["Велоспорт", "Саморазвитие", "Музыка"],
            gender: "Женский",
            city: "Киев",
            orientation: "Гетеросексуал",
            relationshipStatus: "Не в отношениях",
            children: "Нет",
            languages: "Русский",
            personalityType: "Экстраверт",
            zodiacSign: "Рак",
            education: "Высшее",
            job: "Маркетолог"
        },
        {
            id: 2,
            name: "Иван",
            age: 25,
            image: "https://via.placeholder.com/800x600?text=Ivan",
            about: "Обожаю спорт и активный отдых.",
            interests: ["Футбол", "Путешествия", "Фотография"],
            gender: "Мужской",
            city: "Москва",
            orientation: "Гетеросексуал",
            relationshipStatus: "В отношениях",
            children: "Нет",
            languages: "Русский, Английский",
            personalityType: "Интроверт",
            zodiacSign: "Лев",
            education: "Высшее",
            job: "Программист"
        },
        {
            id: 3,
            name: "Анастасия",
            age: 30,
            image: "https://via.placeholder.com/800x600?text=Anastasia",
            about: "Работаю в дизайне, увлекаюсь искусством.",
            interests: ["Искусство", "Кулинария", "Чтение"],
            gender: "Женский",
            city: "Санкт-Петербург",
            orientation: "Гомосексуал",
            relationshipStatus: "Не в отношениях",
            children: "Есть",
            languages: "Русский, Французский",
            personalityType: "Экстраверт",
            zodiacSign: "Близнецы",
            education: "Высшее",
            job: "Дизайнер"
        }
        // Добавьте другие профили по необходимости
    ];
}

// Функция для обновления информации о профиле
function updateProfileInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.carousel-item.active img').src = profile.image;
        document.querySelector('.user-name').textContent = profile.name + ", ";
        document.querySelector('.user-age').textContent = profile.age;
        updateAdditionalInfo(); // Обновление дополнительной информации
    }
}

// Функция для обновления дополнительной информации
function updateAdditionalInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.text-container').textContent = profile.about || "Нет информации";
        const userItems = document.querySelectorAll('.user-item');
        userItems[0].textContent = profile.interests ? profile.interests[0] : "Нет интересов";
        userItems[1].textContent = profile.interests ? profile.interests[1] : "Нет интересов";
        userItems[2].textContent = profile.interests ? profile.interests[2] : "Нет интересов";
        const infoItems = document.querySelectorAll('.into-item');
        infoItems[0].querySelector('span').textContent = profile.gender || "Не указано";
        infoItems[1].querySelector('span').textContent = profile.city || "Не указано";
        infoItems[2].querySelector('span').textContent = profile.orientation || "Не указано";
        infoItems[3].querySelector('span').textContent = profile.relationshipStatus || "Не указано";
        infoItems[4].querySelector('span').textContent = profile.children || "Не указано";
        infoItems[5].querySelector('span').textContent = profile.languages || "Не указано";
        infoItems[6].querySelector('span').textContent = profile.personalityType || "Не указано";
        infoItems[7].querySelector('span').textContent = profile.zodiacSign || "Не указано";
        infoItems[8].querySelector('span').textContent = profile.education || "Не указано";
        infoItems[9].querySelector('span').textContent = profile.job || "Не указано";
    }
}

// Функции для обработки свайпов
function handleTouchStart(event) {
    if (!swipeEnabled) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    currentX = startX;
    currentY = startY;
    isSwiping = false;
}

function handleTouchMove(event) {
    if (!swipeEnabled) return;
    if (!isSwiping) {
        let deltaX = event.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 20) {
            isSwiping = true;
        }
    }

    if (isSwiping) {
        let deltaX = event.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
            const overlayApprove = document.querySelector('.overlay.approve');
            const overlayReject = document.querySelector('.overlay.reject');

            if (deltaX > 0) {
                overlayApprove.style.opacity = Math.min(deltaX / 100, 1);
            } else {
                overlayReject.style.opacity = Math.min(-deltaX / 100, 1);
            }

            let rotateAngle = deltaX * 0.1;
            document.getElementById('cardStack').style.transform = `translateX(${deltaX}px) rotate(${rotateAngle}deg)`;
        }
    }
}

function handleTouchEnd(event) {
    if (!swipeEnabled) return;
    let deltaX = event.changedTouches[0].clientX - startX;
    const cardStack = document.getElementById('cardStack');
    const overlayApprove = document.querySelector('.overlay.approve');
    const overlayReject = document.querySelector('.overlay.reject');

    if (cardStack) {
        cardStack.classList.remove('swipe-right', 'swipe-left');

        if (isSwiping) {
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    approveProfile();
                } else {
                    rejectProfile();
                }
            } else {
                cardStack.style.transform = 'none';
            }

            cardStack.style.transition = 'transform 0.3s ease';
            cardStack.style.transform = 'none';
        }

        setTimeout(() => {
            cardStack.style.transition = 'none';
        }, 300);
    }

    if (overlayApprove) overlayApprove.style.opacity = 0;
    if (overlayReject) overlayReject.style.opacity = 0;
    isSwiping = false;
}

function approveProfile() {
    console.log('Profile approved');
    document.getElementById('cardStack').classList.add('swipe-right');
    setTimeout(() => {
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
    }, 300);
}

function rejectProfile() {
    console.log('Profile rejected');
    document.getElementById('cardStack').classList.add('swipe-left');
    setTimeout(() => {
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
    }, 300);
}

function openSettings() {
    swipeEnabled = false;
    scrollPosition = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add('modal-open');
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    swipeEnabled = true;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
    document.body.classList.remove('modal-open');
    document.getElementById('settingsModal').style.display = 'none';
}

// Инициализация после загрузки документа
document.addEventListener('DOMContentLoaded', () => {
    loadProfiles();
    updateProfileInfo();

    const cardStack = document.getElementById('cardStack');
    cardStack.addEventListener('touchstart', handleTouchStart);
    cardStack.addEventListener('touchmove', handleTouchMove);
    cardStack.addEventListener('touchend', handleTouchEnd);
});
