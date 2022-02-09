const modalMask = document.querySelector('.modal-mask');
const modalContent = document.querySelector('.modal');

// Вставка данных в модальное окно
export const modalContentData = (data) => {
    modalContent.innerHTML = data;
};

// Открытие модального окна
export const openModal = () => {
    modalMask.classList.add('open');
};

// Очистка корзины (если в модальном окне корзина)
export const emptyModal = () => {
    return modalContent.innerHTML = `
                <div class="modal-head">
                    <p class="modal-title">Корзина</p>
                </div>
                <div class="modal-body">
                    <p>Пока ничего нет</p>
                </div>
            `;
};

// Клик по фону модального окна
modalMask.addEventListener('click', ({target}) => {
    if (target === modalMask) {
        modalMask.classList.remove('open');
    }
});