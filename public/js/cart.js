import {modalContentData, openModal, emptyModal} from './modal.js';
import formatPrice from './utils/formatPrice.js';
import LocalStorageClass from './utils/localStorageData.js';

const modal = document.querySelector('.modal');
const showModalCartBtn = document.querySelector('.showModalCartBtn');
const addToCartButton = document.querySelectorAll('.addToCart');
const cart = LocalStorageClass.getLocalStorage('cart') || {};

// ============== Формирование корзины после обновления страницы
const cartData = () => {
    if (Object.keys(cart).length) {
        ajaxGetGoodsInfo();
    }
};
cartData();

// ============== Добавление товара в корзину
const addToCart = ({target}) => {
    const goodsId = target.dataset.goods_id;

    if (!cart[goodsId]) {
        cart[goodsId] = 1;
    } else {
        cart[goodsId]++;
    }

    ajaxGetGoodsInfo();
};

// Клик по кнопкам "В корзину"
for (const item of addToCartButton) {
    item.addEventListener('click', addToCart);
}

// ============== Получаем товары из БД, которые добавили в корзину
async function ajaxGetGoodsInfo() {
    try {
        const goodsData = await fetch('/goods/goods-cart', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(Object.keys(cart)),
        });

        const goods = await goodsData.json();
        LocalStorageClass.setLocalStorage('cart', cart);
        showCart(goods);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// ============== Формирование корзины
const showCart = (goods) => {
    let tableTr = '';
    let allCount = 0;
    let allSum = 0;

    for (const goodsKey in goods) {
        const {id, name, cost} = goods[goodsKey];
        allCount += cart[id];
        allSum += cart[id] * cost;

        tableTr += `
            <tr>
                <td>
                    <p><strong>${name}</strong></p>
                    <p><a href="/goods/${name}">Посмотреть товар</a> | <a href="#">Добавить в список желаний</a></p>
                </td>
                <td>
                    <p class="align-center">
                        <span class="cartCount">${cart[id]}</span>
                        <span class="button-primary button-small cartMinus" data-goods_id="${id}">-</span>
                        <span class="button-primary button-small cartPlus" data-goods_id="${id}">+</span>
                    </p>
                </td>
                <td>
                    <p class="align-right"><strong>${formatPrice(cost)}</strong></p>
                </td>
                <td class="align-right">
                    <button class="button-primary-outlined">Удалить</button>
                </td>
            </tr>
        `;
    }

    const out = `
        <table class="table-cart">
            <thead>
            <tr>
                <th>Товары</th>
                <th>Количество</th>
                <th class="align-right">Стоимость</th>
                <th></th>
            </tr>
            </thead>
            <tbody>         
            ${tableTr}
            <tr>
                <td>
                    <p class="h6"><strong>Общая сумма</strong></p>
                </td>
                <td>
                    <p class="align-center">${allCount}</p>
                </td>
                <td>
                    <p class="align-right"><strong>${formatPrice(allSum)}</strong></p>
                </td>
                <td class="align-right">
                    <button class="button-primary">
                        <a class="button-primary" href="/order">Оформить заказ</a>
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    `;

    modalContentData(out);
};

// ============== Клик по кнопке "Корзина"
showModalCartBtn.addEventListener('click', () => {
    openModal();
});

// Клик внутри корзины
modal.addEventListener('click', ({target}) => {
    const goodsId = target.dataset.goods_id;

    if (target.classList.contains('cartMinus')) {
        if (cart[goodsId] < 2) {
            delete cart[goodsId];
            LocalStorageClass.delLocalStorage('cart');
        } else {
            target.closest('.align-center').querySelector('.cartCount').textContent = (--cart[goodsId]).toString();
        }

        // Когда в корзине не осталось товаров
        if (!Object.keys(cart).length) {
            emptyModal();
        }

        //
        ajaxGetGoodsInfo();
    }

    if (target.classList.contains('cartPlus')) {
        target.closest('.align-center').querySelector('.cartCount').textContent = (++cart[goodsId]).toString();
        ajaxGetGoodsInfo();
    }
});















