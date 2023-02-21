// 多重if_else优化(胖分支优化)
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 商品售罄 4 开团成功 5 系统取消
 */
const onButtonClick = (status) => {
    if (status == 1) {
        sendLog('processing')
        jumpTo('IndexPage')
    } else if (status == 2) {
        sendLog('fail')
        jumpTo('FailPage')
    } else if (status == 3) {
        sendLog('fail')
        jumpTo('FailPage')
    } else if (status == 4) {
        sendLog('success')
        jumpTo('SuccessPage')
    } else if (status == 5) {
        sendLog('cancel')
        jumpTo('CancelPage')
    } else {
        sendLog('other')
        jumpTo('Index')
    }
}

/**
 * 优化一
 * 判断条件作为对象的属性名，
 * 将处理逻辑作为对象的属性值，
 * 在按钮点击的时候，通过对象属性查找的方式来进行逻辑判断，
 * 这种写法特别适合一元条件判断的情况
 */
const actions1 = {
    '1': ['processing', 'IndexPage'],
    '2': ['fail', 'FailPage'],
    '3': ['fail', 'FailPage'],
    '4': ['success', 'SuccessPage'],
    '5': ['cancel', 'CancelPage'],
    'default': ['other', 'Index'],
}
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1开团进行中 2开团失败 3 商品售罄 4 开团成功 5 系统取消
 */
const onButtonClick1 = (status) => {
    let action = actions[status] || actions['default'],
        logName = action[0],
        pageName = action[1]
    sendLog(logName)
    jumpTo(pageName)
}

/**
 * 优化二
 * 使用map结构,将判断条件作为key
 * 符合条件执行的操作作为value
 * 由于map的键可以为任意值,
 * 这种写法更适合判断条件较为复杂的情况
 */
const actions2 = new Map([
    [1, ['processing', 'IndexPage']],
    [2, ['fail', 'FailPage']],
    [3, ['fail', 'FailPage']],
    [4, ['success', 'SuccessPage']],
    [5, ['cancel', 'CancelPage']],
    ['default', ['other', 'Index']]
])
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 商品售罄 4 开团成功 5 系统取消
 */
const onButtonClick2 = (status) => {
    let action = actions.get(status) || actions.get('default')
    sendLog(action[0])
    jumpTo(action[1])
}

// ----------------------------------------------------------------------------------------

// 问题升级,以前按钮点击时候只需要判断status，现在还需要判断用户的身份：
/**
 * 按钮点击事件
 * @param {number} status 活动状态：1开团进行中 2开团失败 3 开团成功 4 商品售罄 5 有库存未开团
 * @param {string} identity 身份标识：guest客态 master主态
 */
const onButtonClicks = (status, identity) => {
    if (identity == 'guest') {
        if (status == 1) {
            //do sth
        } else if (status == 2) {
            //do sth
        } else if (status == 3) {
            //do sth
        } else if (status == 4) {
            //do sth
        } else if (status == 5) {
            //do sth
        } else {
            //do sth
        }
    } else if (identity == 'master') {
        if (status == 1) {
            //do sth
        } else if (status == 2) {
            //do sth
        } else if (status == 3) {
            //do sth
        } else if (status == 4) {
            //do sth
        } else if (status == 5) {
            //do sth
        } else {
            //do sth
        }
    }
}

/**
 * 优化一
 * 把两个条件拼接成字符串，并通过以条件拼接字符串作为键，
 * 以处理函数作为值的Map对象进行查找并执行，
 * 这种写法在多元条件判断时候尤其好用。
 */
const actions3 = new Map([
    ['guest_1', () => {/*do sth*/ }],
    ['guest_2', () => {/*do sth*/ }],
    ['guest_3', () => {/*do sth*/ }],
    ['guest_4', () => {/*do sth*/ }],
    ['guest_5', () => {/*do sth*/ }],
    ['master_1', () => {/*do sth*/ }],
    ['master_2', () => {/*do sth*/ }],
    ['master_3', () => {/*do sth*/ }],
    ['master_4', () => {/*do sth*/ }],
    ['master_5', () => {/*do sth*/ }],
    ['default', () => {/*do sth*/ }],
])

/**
 * 按钮点击事件
 * @param {string} identity 身份标识：guest客态 master主态
 * @param {number} status 活动状态：1 开团进行中 2 开团失败 3 开团成功 4 商品售罄 5 有库存未开团
 */
const onButtonClick3 = (identity, status) => {
    let action = actions3.get(`${identity}_${status}`) || actions3.get('default')
    action.call(this)
}

/**
 * Map对象，以Object对象作为key
 */
const actions = new Map([
    [{ identity: 'guest', status: 1 }, () => {/*do sth*/ }],
    [{ identity: 'guest', status: 2 }, () => {/*do sth*/ }],
    //...
])

const onButtonClick4 = (identity, status) => {
    let action = [...actions].filter(([key, value]) => (key.identity == identity && key.status == status))
    action.forEach(([key, value]) => value.call(this))
}

// -----------------------------------------------------------------------------------------------

// 问题升级,假如guest情况下，status1-4的处理逻辑都一样
/**
 * 最差情况下
 */
const action = new Map([
    [{ identity: 'guest', status: 1 }, () => {/* functionA */ }],
    [{ identity: 'guest', status: 2 }, () => {/* functionA */ }],
    [{ identity: 'guest', status: 3 }, () => {/* functionA */ }],
    [{ identity: 'guest', status: 4 }, () => {/* functionA */ }],
    [{ identity: 'guest', status: 5 }, () => {/* functionB */ }],
    //...
])

/**
 * 将处理逻辑函数进行缓存
 */
const action1 = () => {
    const functionA = () => {/*do sth*/ }
    const functionB = () => {/*do sth*/ }
    return new Map([
        [{ identity: 'guest', status: 1 }, functionA],
        [{ identity: 'guest', status: 2 }, functionA],
        [{ identity: 'guest', status: 3 }, functionA],
        [{ identity: 'guest', status: 4 }, functionA],
        [{ identity: 'guest', status: 5 }, functionB],
        //...
    ])
}

const onButtonClick5 = (identity, status) => {
    let action = [...action1()].filter(([key, value]) => (key.identity == identity && key.status == status))
    action.forEach(([key, value]) => value.call(this))
}

// 假如判断条件变得特别复杂，比如identity有3种状态，status有10种状态，
/**
 * 认真一点讲，上面重写了4次functionA还是有点不爽，
 * 那你需要定义30条处理逻辑，而往往这些逻辑里面很多都是相同的
 * 这里Map的优势更加凸显，可以用正则类型作为key了
 */
const action2 = () => {
    const functionA = () => {/*do sth*/ }
    const functionB = () => {/*do sth*/ }
    return new Map([
        [/^guest_[1-4]$/, functionA],
        [/^guest_5$/, functionB],
        //...
    ])
}

const onButtonClick6 = (identity, status) => {
    let action = [...action2()].filter(([key, value]) => (key.test(`${identity}_${status}`)))
    action.forEach(([key, value]) => value.call(this))
}

// ---------------------------------------------------------------------------------------

// 假如需求变成，凡是guest情况都要发送一个日志埋点,不同status情况也需要单独的逻辑处理
/**
 * 也就是说利用数组循环的特性，
 * 符合正则条件的逻辑都会被执行，
 * 那就可以同时执行公共逻辑和单独逻辑
 */
const action3 = () => {
    const functionA = () => {/*do sth*/ }
    const functionB = () => {/*do sth*/ }
    const functionC = () => {/*send log*/ }
    return new Map([
        [/^guest_[1-4]$/, functionA],
        [/^guest_5$/, functionB],
        [/^guest_.*$/, functionC],
        //...
    ])
}

const onButtonClick7 = (identity, status) => {
    let action = [...action3()].filter(([key, value]) => (key.test(`${identity}_${status}`)))
    action.forEach(([key, value]) => value.call(this))
}
