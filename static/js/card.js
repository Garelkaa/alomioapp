// Глобальные переменные
let startX, startY, currentX, currentY;
let isSwiping = false;
let swipeEnabled = true;
let profiles = [];
let currentIndex = 0;

// Функция для загрузки профилей
function loadProfiles() {
    fetch('/card/get_profiles/')
        .then(response => response.json())
        .then(data => {
            profiles = data;
            currentIndex = 0; // Сбрасываем индекс
            updateProfileInfo();
            updateCarousel();
        })
        .catch(error => console.error('Ошибка при загрузке профилей:', error));
}

// Функция для обновления карусели
function updateCarousel() {
    const carouselInner = document.getElementById('carouselInner');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    carouselInner.innerHTML = ''; // Очищаем старые элементы карусели
    indicatorsContainer.innerHTML = ''; // Очищаем старые индикаторы

    if (profiles.length > 0) {
        const profile = profiles[currentIndex];

        // Создаем новый элемент карусели
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item', 'active'); // Активный элемент
        const img = document.createElement('img');
        img.src = profile.image;
        img.classList.add('d-block', 'w-100');
        img.alt = `Image of ${profile.name}`;
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);

        // Создаем один индикатор
        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#carouselExampleControls');
        indicator.setAttribute('data-slide-to', '0'); // Индикатор только для текущего профиля
        indicator.classList.add('active'); // Активный индикатор
        indicatorsContainer.appendChild(indicator);
    }
}


// Функция для обновления информации о профиле
function updateProfileInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.user-name').textContent = profile.name || "Не указано";
        document.querySelector('.user-age').textContent = profile.age || "Не указано";

        // Обновляем дополнительную информацию
        updateAdditionalInfo();
    }
}

// Функция для обновления дополнительной информации
function updateAdditionalInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.text-container').textContent = profile.about || "Нет информации";
        const userItems = document.querySelector('.user-items-container');
        userItems.innerHTML = ''; // Очищаем старые интересы
        // Предполагается, что интересы хранятся в виде строки, разделенной запятыми
        if (profile.interests) {
            profile.interests.split(',').forEach(interest => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('user-item');
                itemDiv.textContent = interest.trim();
                userItems.appendChild(itemDiv);
            });
        }

        const infoItems = document.querySelectorAll('.into-item');
        infoItems[0].querySelector('span').textContent = profile.gender || "Не указано";
        infoItems[1].querySelector('span').textContent = profile.city || "Не указано";
        infoItems[2].querySelector('span').textContent = profile.orientation || "Не указано";
        infoItems[3].querySelector('span').textContent = profile.relationship || "Не указано";
        infoItems[4].querySelector('span').textContent = profile.childrens || "Не указано";
        infoItems[5].querySelector('span').textContent = profile.languages || "Не указано";
        infoItems[6].querySelector('span').textContent = profile.personality || "Не указано";
        infoItems[7].querySelector('span').textContent = profile.zodiac || "Не указано";
        infoItems[8].querySelector('span').textContent = profile.education || "Не указано";
        infoItems[9].querySelector('span').textContent = profile.work || "Не указано";
    }
}

function updateCarouselIndicators() {
    updateCarousel(); // Обновляем карусель при изменении индексов
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
        } else {
            cardStack.style.transform = 'none';
        }

        cardStack.style.transition = 'transform 0.3s ease';
        cardStack.style.transform = 'none';
    }

    // Скрываем оверлеи
    if (overlayApprove) overlayApprove.style.opacity = 0;
    if (overlayReject) overlayReject.style.opacity = 0;
    isSwiping = false;
}



function approveProfile() {
    console.log('Profile approved');
    document.getElementById('cardStack').classList.add('swipe-right');
    const overlayApprove = document.querySelector('.overlay.approve');
    if (overlayApprove) {
        overlayApprove.style.opacity = 1;
    }
    setTimeout(() => {
        // Переходим к следующей анкете
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
        updateCarousel();
    }, 300);
}


function rejectProfile() {
    console.log('Profile rejected');
    document.getElementById('cardStack').classList.add('swipe-left');
    const overlayReject = document.querySelector('.overlay.reject');
    if (overlayReject) {
        overlayReject.style.opacity = 1;
    }
    setTimeout(() => {
        // Переходим к следующей анкете
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
        updateCarousel();
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
    updateCarousel();

    const cardStack = document.getElementById('cardStack');
    cardStack.addEventListener('touchstart', handleTouchStart);
    cardStack.addEventListener('touchmove', handleTouchMove);
    cardStack.addEventListener('touchend', handleTouchEnd);
});
