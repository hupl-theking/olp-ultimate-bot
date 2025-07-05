const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat').plugin;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalNear } = require('mineflayer-pathfinder').goals;
const fs = require('fs');

const bot = mineflayer.createBot({
  host: '191.96.231.12',
  port: 11622,
  username: 'Dolp'
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat);

let memory = {};

try {
  memory = JSON.parse(fs.readFileSync('memory.json'));
} catch {
  memory = {};
}

bot.once('spawn', () => {
  bot.chat("Dolp أونلاين ✅");
  setInterval(() => {
    const player = bot.nearestEntity(entity => entity.type === 'player');
    if (player) {
      bot.lookAt(player.position.offset(0, 1.6, 0));
      bot.chat(`أهلًا ${player.username}`);
    }
  }, 10000);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (!memory[username]) memory[username] = [];

  memory[username].push(message);
  fs.writeFileSync('memory.json', JSON.stringify(memory, null, 2));

  if (message === 'تعال') {
    const target = bot.players[username]?.entity;
    if (target) {
      const goal = new GoalNear(target.position.x, target.position.y, target.position.z, 1);
      bot.pathfinder.setGoal(goal);
      bot.chat("جايك 😎");
    }
  } else if (message === 'نام') {
    const bed = bot.findBlock({ matching: block => bot.isABed(block) });
    if (bed) {
      bot.chat("بنام 🛌");
      bot.sleep(bed);
    } else {
      bot.chat("مافي سرير 😢");
    }
  } else if (message === 'قف') {
    bot.pathfinder.setGoal(null);
    bot.chat("وقفت ✅");
  }
});
