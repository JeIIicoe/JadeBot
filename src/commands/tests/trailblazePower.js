const { SlashCommandBuilder } = require("discord.js");
const formatDuration = require('../../modularity/formatDuration.js');
const formatDateTime = require('../../modularity/dateTime.js');

const activeTimers = {};

module.exports = {
  activeTimers,
  data: new SlashCommandBuilder()
    .setName('power')
	  .setDescription('Set a reminder for 30m before your Trailblaze power caps out.')
    .addNumberOption(option =>
      option
        .setName('currentpower')
        .setDescription('How much Trailblaze Power you have left (between 0 and 210)')
        .setMaxValue(210)
        .setMinValue(0)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const duration = interaction.options.getNumber('currentpower');

    if (activeTimers[userId]) {
      const currentPower = 240 - (Math.round((activeTimers[userId].endTime - Date.now()) / 60000));
      await interaction.reply(`Your tracker is in progress. You currently have about **${currentPower}** <:tbp:1201581164671029358>`);
      return;
    }

    await interaction.deferReply();

    function setAlarm(value) {
      return new Promise((resolve) => {
  
          const alarmTimeInMinutes = 6 * (210 - value);
          const alarmEndTime = Date.now() + alarmTimeInMinutes * 60 * 1000; //alrm end time
          const formattedDuration = formatDuration(6*(210-duration));
          const alarmDateTime = new Date(alarmEndTime)
          const formattedEndTime = formatDateTime(alarmDateTime);

          interaction.editReply({
            content: `You've inputted **${value}** <:tbp:1201581164671029358>.\n\nYour power will reach 210 at **${formattedEndTime}** | In **${formattedDuration}.**`
          })

          activeTimers[userId] = {
            alarmId: setTimeout(() => {
              resolve(`Your power will fully replenish in 30 minutes!`);
              delete activeTimers[userId];
            }, alarmTimeInMinutes * 60 * 1000),
            endTime: alarmEndTime,
          }
      });
    }

    setAlarm(duration).then(async message => {
      await new Promise(resolve => setTimeout(resolve, (6 * (210 - duration)) * 60 * 1000));
      await interaction.followUp({
        content: `<@${interaction.user.id}> ${message}`})
    }).catch(async error => {
      await interaction.editReply({
        content: `There was an error with this request: ${error}`});
    });
  },
};
