/**
 * Реализация метода ветвей и границ для задачи о назначениях с ограничением по времени
 * @param n - количество задач
 * @param m - количество исполнителей
 * @param expenses - матрица затрат
 * @param times - матрица времен выполнения
 * @param plannedDuration - плановый период
 * @returns {{
 *     cost:Number,
 *     time:Number,
 *     variant:[Number]
 * }}
 */
const algorithm = (n, m, expenses, times, plannedDuration) => {
    let record = {
        cost: Number.MAX_SAFE_INTEGER,
        time: 0,
        variant: []
    }

    /**
     * Возвращает индекс минимального элемента массива
     * @param a - массив
     * @returns {number}
     */
    function indexOfSmallest(a) {
        return a.reduce((lowest, next, index) => next < a[lowest] ? index : lowest, 0);
    }

    /**
     * Возвращает длительность работы при заданых данных
     * @param except - назначенные задания
     * @returns {number}
     */
    const getTime = (except) => {
        const workers = []
        for (let i = 0; i < m; i++)
            workers.push(0)
        except.forEach((item, index) => workers[item] += times[index][item])
        return Math.max(...workers)
    }
    /**
     * Возвращаят затраты работы при заданных данных
     * @param except - назначенные задания
     * @returns {number}
     */
    const getExpense = (except) => {
        return except.map((item, index) => expenses[index][item]).reduce((a, b) => a + b, 0)
    }
    /**
     * Возвращает вес вершины
     * @param except - назначенные задания
     * @returns {number}
     */
    const getWeight = (except) => {
        const weight = getExpense(except)
        const time = getTime(except)
        if (time > plannedDuration)
            return Number.MAX_SAFE_INTEGER
        const bestWay = expenses.map((line, index) => index < except.length ? 0 : Math.min(...line)).reduce((a, b) => a + b, 0)
        return weight + bestWay
    }


    /**
     * Рекурсивный метод реализующий метод ветвей и границ с возвратом
     * @param excerpt - назначенные задания
     * @returns {number}
     */
    const tree = (excerpt = []) => {
        if (excerpt.length === n) {
            const weight = getWeight(excerpt)
            if (record.cost > weight) {
                record = {
                    cost: weight,
                    time: getTime(excerpt),
                    variant: [...excerpt]
                }
            }
            return weight
        }
        const edges = []
        for (let k = 0; k < m; k++) {
            edges.push(getWeight([...excerpt, k]))
        }
        while (record.cost > Math.min(...edges)) {
            const index = indexOfSmallest(edges);
            edges[index] = tree([...excerpt, index])
        }
        return Math.min(...edges)
    }
    tree()
    return record
}


module.exports.algorithm = algorithm