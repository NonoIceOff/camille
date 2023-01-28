const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { toTimeFormat } = require("../../utils/date");
const UserItem = require("../userItem");
const shopItems = require("./shopItems");

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function shopNav(interaction) {
    const emotes = [
        "<:poll1:1017112408248041543>",
        "<:poll2:1017113079869341818>",
        "<:poll3:1017113080989221016>",
        "<:poll4:1017113694854979674>",
        "<:poll5:1017113696130060348>",
        "<:poll6:1017113697166041108>",
        "<:poll7:1017114267356504114>",
        "<:poll8:1017114268564463626>",
        "<:poll9:1017114270120562728>",
        "<:poll10:1017114271437553815>",
    ];

    const coin = await interaction.user.getCoin();

    let shopItemsArray = Object.values(shopItems).sort((a, b) => a.id - b.id);

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":barber: __Shop :__ ").setDescription(`Vous avez **${
        Math.floor(coin * 10) / 10
    } :coin:**
        
${shopItemsArray
    .map((item, i) => `${emotes[i]} ${item.name} (${item.price} :coin:)`)
    .join("\n")}`);

    const rows = [
        new ActionRowBuilder().addComponents(
            shopItemsArray.splice(0, 5).map((item, i) => {
                return new ButtonBuilder()
                    .setCustomId(`cmd/shop/details/${item.id}`)
                    .setEmoji(emotes[i])
                    .setStyle(ButtonStyle.Secondary);
            })
        ),
    ];
    if (shopItemsArray.length) {
        rows.push(
            new ActionRowBuilder().addComponents(
                shopItemsArray.map((item, i) => {
                    return new ButtonBuilder()
                        .setCustomId(`cmd/shop/details/${item.id}`)
                        .setEmoji(emotes[i + 5])
                        .setStyle(ButtonStyle.Secondary);
                })
            )
        );
    }

    interaction.editReply({
        content: "",
        embeds: [embed],
        components: rows,
    });
}

/**
 * Edit the interaction message to the details of an item.
 * @param {import("discord.js").Interaction} interaction 
 * @param {number} itemId 
 */
async function shopDetails(interaction, itemId) {
    let item = shopItems[itemId];

    const coin = await interaction.user.getCoin();
    /** @type {UserItem}*/
    const invItem = await interaction.user.getItem(item.id);

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(`:barber: __Détails de ${item.name}__ `)
        .setDescription(
            `Vous avez **${Math.floor(coin * 10) / 10} :coin:**
        
${item.description}`
        )
        .addFields({
            name: "Prix",
            value: `${item.price} :coin:`,
            inline: true,
        });

    if (invItem.quantity > 0) {
        embed.addFields({
            name: "Vous possedez",
            value: `${invItem.quantity}x ce produit`,
            inline: true,
        });
    }

    const expireIn = await item.calcExpire(invItem);
    if (expireIn > 0) {
        embed.addFields({
            name: "Expire dans",
            value: toTimeFormat(await expireIn, true, true, false, true),
            inline: true,
        });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`cmd/shop/nav/0`)
            .setLabel("⬅️ Retour")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`cmd/shop/buy/${itemId}/1`)
            .setLabel("💸 Acheter 1")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(item.price > coin),
        new ButtonBuilder()
            .setCustomId(`cmd/shop/buyX/${itemId}`)
            .setLabel("💸 Acheter...")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(item.price > coin)
    );

    interaction.editReply({
        content: "",
        embeds: [embed],
        components: [row],
    });
}

module.exports = {
    shopNav,
    shopDetails,
};
