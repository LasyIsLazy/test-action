const ora = require('ora')
const spinner = ora({
    text: 'Loading unicorns',
    isEnabled: false
}).start();
setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
    setTimeout(() => {
        spinner.succeed('xxx')
        spinner.fail('xxx')
    }, 1000);
}, 1000);
