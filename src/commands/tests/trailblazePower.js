const { SlashCommandBuilder } = require("discord.js");

const activeTimers = {};

module.exports = {
  activeTimers,
  data: new SlashCommandBuilder()
    .setName('tbpreminder')
	  .setDescription('Set a reminder for when your Trailblaze power caps out')
    .addNumberOption(option =>
      option
        .setName('power')
        .setDescription('How much Trailblaze Power you have left (between 0 and 210)')
        .setMaxValue(210)
        .setMinValue(0)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const duration = interaction.options.getNumber('power');

    if (activeTimers[userId]) {
      const remainingTime = Math.round((activeTimers[userId].endTime - Date.now()) / 60000);
      await interaction.reply(`You already have a Trailblaze Alarm set with about ${remainingTime} minutes left.`);
      return;
    }

    await interaction.deferReply();

    function setAlarm(value) {
      return new Promise((resolve, reject) => {
          if (value < 0 || value > 210) {
              reject('Value must be between 0 and 210.');
              return;
          }
  
          const alarmTimeInMinutes = 240 - value - 30;
          const alarmEndTime = Date.now() + alarmTimeInMinutes * 60 * 1000;

          interaction.editReply({
            content: `Your Trailblaze Power reminder has been set. You'll be reminded in ${240-duration-30} minutes! (30m before it fills)`
          })

          activeTimers[userId] = {
            alarmId: setTimeout(() => {
              resolve("Your Trailblaze Power has been fully replenished.");
              delete activeTimers[userId];
            }, alarmTimeInMinutes * 60 * 1000),
            endTime: alarmEndTime,
          }
      });
  }

    setAlarm(duration).then(async message => {
      await new Promise(resolve => setTimeout(resolve, (240 - duration - 30) * 60 * 1000));
      await interaction.followUp({
        content: `<@${interaction.user.id}> ${message}`})
    }).catch(async error => {
      await interaction.editReply({
        content: `There was an error with this request: ${error}`});
    });
  },
};
