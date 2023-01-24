const { SlashCommandBuilder } = require("@discordjs/builders");
const UserItem = require("../inventory/userItem");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    const itemsName = ["Pass 30 jours pour le grade Dream Team","Pass 30 jours pour le grade Dream Team +","Pass 30 jours pour le grade Super Dream Team"];

    /**
     * @type {UserItem[]}
     */
    const items = await interaction.user.getItems();

    await interaction.reply(`Votre inventaire :
    
${items.sort((a,b)=>a.itemId-b.itemId).filter((item)=>item.quantity>0).map((item)=>`    - ${item.quantity}x ${itemsName[item.itemId]}`).join("\n")}`);
}

const definition = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test");

module.exports = {
    onTrigger,
    definition,
};
