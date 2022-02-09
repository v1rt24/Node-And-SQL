import LocalStorageClass from './utils/localStorageData.js';
import {modalContentData, openModal} from './modal.js';
import formatPrice from './utils/formatPrice.js';

const showModalCartBtn = document.querySelector('.showModalCartBtn');
const cart = LocalStorageClass.getLocalStorage('cart');
const tbodyEl = document.querySelector('.tbodyEl');

if (location.pathname === '/order') {
    showModalCartBtn.remove();
    const formOrderSubmit = document.getElementById('formOrderSubmit');
    const validationError = formOrderSubmit.getElementsByClassName('validation-error');

    // Формирование товаров страницы заказа
    const renderOrders = (orders) => {
        tbodyEl.textContent = '';

        const trHTML = orders.map(order => {
            const tr = document.createElement('tr');
            tr.insertAdjacentHTML('beforeend', `
                <td>
                    <p><strong>${order.name}</strong></p>
                    <p><a href="/goods/${order.name}">Посмотреть товар</a> | <a href="#">Добавить в список желаний</a></p>
                </td>
                <td>
                    <p class="align-center">
                        <span class="cartCount">${cart[order.id]}</span>
                        <span class="button-primary button-small cartMinus" data-goods_id="${order.id}">-</span>
                        <span class="button-primary button-small cartPlus" data-goods_id="${order.id}">+</span>
                    </p>
                </td>
                <td>
                    <p class="align-right"><strong>${formatPrice(order.cost)}</strong></p>
                </td>
            `);

            return tr;
        });

        const dataSum = orders.reduce((acc, item, idx) => {
            if (idx === 0) {
                acc['count'] = 0;
                acc['sum'] = 0;
            }

            acc['count'] += cart[item.id];
            acc['sum'] += cart[item.id] * item.cost;

            return acc;
        }, {});

        const tr2 = document.createElement('tr');
        tr2.insertAdjacentHTML('beforeend', `
            <tr>
                <td>
                    <p class="h6"><strong>Общая сумма</strong></p>
                </td>
                <td>
                    <p class="align-center">${dataSum.count}</p>
                </td>
                <td>
                    <p class="align-right"><strong>${formatPrice(dataSum.sum)}</strong></p>
                </td>
            </tr>
        `);

        trHTML.push(tr2);
        return trHTML;
    };

    const renderCart = async () => {
        if (cart) {
            const resDb = await fetch('/order', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(cart),
            });

            const res = await resDb.json();
            const resHTML = renderOrders(res);
            tbodyEl.append(...resHTML);
            LocalStorageClass.setLocalStorage('cart', cart);
        }
    };
    renderCart();
    // /Формирование товаров страницы заказа


    // ============== Изменение количества товара
    const renderCount = (name, target) => {
        const id = target.dataset.goods_id;
        const parent = target.closest('.align-center');
        const cartCount = parent.querySelector('.cartCount');

        if (name === 'cartMinus') {
            cartCount.textContent = (--cart[id]).toString();

            if (+cartCount.textContent < 1) {
                delete cart[id];
                LocalStorageClass.delLocalStorage('cart');
            }
        } else {
            cartCount.textContent = (++cart[id]).toString();
        }

        if (!Object.keys(cart).length) {
            tbodyEl.innerHTML = '<h3>Товаров нет</h3>';
        }

        renderCart();
    };

    tbodyEl.addEventListener('click', ({target}) => {
        if (target.classList.contains('cartMinus')) {
            renderCount('cartMinus', target);
        }

        if (target.classList.contains('cartPlus')) {
            renderCount('cartPlus', target);
        }
    });
    // ============== /Изменение количества товара


    // ===================================== Отправка формы

    formOrderSubmit.addEventListener('submit', async ev => {
        try {
            ev.preventDefault();

            if (!cart) {
                modalContentData('<h3>Заказ невозможно оформить, т.к. товаров в корзине нет</h3>');
                return openModal();
            }

            const target = ev.target;
            await validateFieldsForm(target);

            const dataDb = await fetch('/order/finish-order', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    name: target.elements.name.value,
                    tel: target.elements.tel.value,
                    email: target.elements.email.value,
                    address: target.elements.address.value,
                    cart: JSON.stringify(cart),
                }),
            });

            const res = await dataDb.json();

            if (res === 0) {
                modalContentData('<h3>Заказ невозможно оформить, т.к. товаров в корзине нет</h3>');
                return openModal();
            }

            formOrderSubmit.reset();
            LocalStorageClass.delLocalStorage('cart');
        } catch (error) {
            console.log(error);
        }
    });

    // ================= Валидация полей формы
    const validateFieldsForm = (target) => {
        return new Promise((resolve, reject) => {
            removeError();

            const elems = [...target.elements].filter(el => el.tagName !== 'BUTTON' && el.type !== 'checkbox');

            if (!elems.every(el => el.value)) {
                for (const elem of elems) {
                    if (!elem.value) {
                        displayErrors(elem, 'Заполните поле');
                    }
                }

                return reject('Заполните все поля');
            }

            if (!target.elements.checkbox.checked) {
                displayErrors(target.elements.checkbox, 'Отметьте галку');
                return reject('Поставьте галку');
            }

            resolve();
        });
    };

    // Вывод ошибок
    const displayErrors = (elem, text) => {
        const parent = elem.closest('.form-control');
        parent.insertAdjacentHTML('beforeend', `<p class="validation-error">${text}</p>`);
    };

    // Удаление блоков с ошибкой
    const removeError = () => {
        if (validationError.length) {
            for (const validationErrorElement of [...validationError]) {
                validationErrorElement.remove();
            }
        }
    };
}