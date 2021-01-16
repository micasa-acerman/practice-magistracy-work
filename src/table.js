/**
 * Очистить таблицу
 * @param element - указатель на таблицу
 */
const clearTable = (element) => {
    element.find('tr').remove()
}
/**
 *  Создание таблицы по ее селектора n-ой размерности
 * @param element - указатель на таблицу
 * @param n - количество задач
 * @param m - количество исполнителей
 */
const createTable = (element, n, m) => {
    clearTable(element)
    const rows = []
    for (let i = 0; i < n; i++) {
        const cells = []
        for (let j = 0; j < m; j++) {
            cells.push($(`<td class="cell cell-${i}-${j}"><input /></td>`))
        }
        rows.push($('<tr></tr>').append(cells))
    }
    element.append(rows)
}

/**
 * Функция возвращает двумерный массив значений таблицы
 * @param element - указатель на таблицу
 * @returns {[[number]]}
 */
const getTableValues = (element) => {
    const array = element.find('input').map(function () {
        return +this.value
    }).get()
    return array.chunk(Math.sqrt(array.length))
}

module.exports = {
    ...module.exports,
    createTable,
    getTableValues,
    clearTable
}