let $ = require('jquery');
require('popper.js');
require('bootstrap');
const tables = require('./src/table')
const {algorithm} = require("./src/algorithm");

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

const getAssignedTasks = (variant) => {
    const result = []
    variant.forEach((item, index) => result[item] ? result[item].push(index) : result[item] = [index])
    return result
}

$(document).ready(() => {
    const $workersCount = $('#workers-count')
    const $tasksCount = $('#tasks-count')
    const $plannedDuration = $('#planned-duration')
    const $tableExpenses = $('#table-container-expenses')
    const $tableTimes = $('#table-container-times')
    const $alertContainer = $('#alert-container')

    // Слушатели событий
    $('#clear').click(() => {
        $tasksCount.val('').removeAttr('disabled');
        $workersCount.val('').removeAttr('disabled');
        $plannedDuration.val('').removeAttr('disabled');

        tables.clearTable($tableExpenses)
        tables.clearTable($tableTimes)
        $('#build').removeAttr('disabled')
        $('#clear,#start').attr('disabled', 'disabled')
    })

    $('#build').click(() => {
        const n = $tasksCount.val(), m = $workersCount.val();
        tables.createTable($tableExpenses, n, m)
        tables.createTable($tableTimes, n, m)

        $tasksCount.attr('disabled', 'disabled')
        $workersCount.attr('disabled', 'disabled')
        $plannedDuration.attr('disabled', 'disabled')
        $('#build').attr('disabled', 'disabled')
        $('#clear,#start').removeAttr('disabled')
    })

    $('#start').click(() => {
        const expenses = tables.getTableValues($tableExpenses)
        const times = tables.getTableValues($tableTimes)
        const n = +$tasksCount.val(), m = +$workersCount.val(), T = +$plannedDuration.val();
        const startTime = new Date();
        const result = algorithm(n, m, expenses, times, T)
        const delta = (new Date() - startTime) / 1000
        $alertContainer.find('div').remove()
        if (result.cost !== Number.MAX_SAFE_INTEGER)
            $(`<div class="alert alert-success"><strong>Результат</strong> S=${result.cost},T=${result.time},распределение:${
                getAssignedTasks(result.variant).map((item, index) => `Работник ${index + 1}={${item.map(x => x + 1).join(',')}}. Время работы: ${delta} сек.`)
            }</div>`).appendTo($alertContainer)
        else
            $(`<div class="alert alert-danger">Нет решений</div>`).appendTo($alertContainer)
    })
})
