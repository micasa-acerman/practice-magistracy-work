let $ = require('jquery');
require('popper.js');
require('bootstrap');

Object.defineProperty(Array.prototype, 'chunk', {
    value: function (chunkSize) {
        const array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

$(document).ready(() => {
    const $plannedDuration = $('#plannedDuration')
    const $inputSize = $('#inputSize')
    const $tableExpenses = $('#table-container-expenses')
    const $tableTimes = $('#table-container-times')

    /**
     *  Создание таблицы по ее селектора n-ой размерности
     * @param element - указатель на таблицу
     * @param n - размерность таблицы
     */
    const createTable = (element, n) => {
        element.find('tr').remove()
        const rows = []
        for (let i = 0; i < n; i++) {
            const cells = []
            for (let j = 0; j < n; j++) {
                cells.push($(`<td class="cell cell-${i}-${j}"><input /></td>`))
            }
            rows.push($('<tr></tr>').append(cells))
        }
        element.append(rows)
    }

    const getTableValues = (element) => {
        const array = element.find('input').map(function () {
            return +this.value
        })
            .get()
        return array.chunk(Math.sqrt(array.length))
    }


    $inputSize.change((event) => {
        event.stopPropagation()

        createTable($tableExpenses, event.target.value)
        createTable($tableTimes, event.target.value)
    })

    $('#btnClear').click(() => {
        $inputSize.val('')
        $plannedDuration.val('')
    })
    $('#btnStart').click(() => {
        const expenses = getTableValues($tableExpenses)
        const times = getTableValues($tableTimes)
        console.log('expenses', expenses)
    })
})
