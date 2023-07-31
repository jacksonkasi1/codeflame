
const schema = {
    keys: [
        {
            key: 'todo',
            bgColor: '#ff0',
            color: '#000',
            highlightBg: true,
            highlightWordsAll: false,
            highlightLine: false,
            highlightLineBg: false,
        },
        {
            key: '@todo',
            bgColor: '#fff',
            color: '#adff2f',
            highlightBg: true,
            highlightWordsAll: false,
            // highlightLine: true,
            highlightLineBg: false,
        }
    ]
}

module.exports = { schema };