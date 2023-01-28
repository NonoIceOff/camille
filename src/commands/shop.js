const {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    ModalSubmitInteraction,
    TextInputStyle,
    SlashCommandBuilder,
    ActionRowBuilder,
} = require("discord.js");
const { shopNav, shopDetails } = require("../inventory/shop/shop");
const shopItems = require("../inventory/shop/shopItems");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    await interaction.reply("Je travaille dessus ...");
    await shopNav(interaction);
}

/**
 * Triggered when a button is pressed
 * @param {ButtonInteraction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 */
async function onButton(interaction, path) {
    if (interaction.user.id === interaction.message.interaction.user.id) {
        if (path[2] === "details") {
            await interaction.deferUpdate();
            shopDetails(interaction, path[3]);
        } else if (path[2] === "nav") {
            await interaction.deferUpdate();
            shopNav(interaction, path[3]);
        } else if (path[2] === "buy") {
            const buyCode = await interaction.user.buyItem(path[3], path[4]);
            if (buyCode == 0) {
                await interaction.deferUpdate();
                shopDetails(interaction, path[3]);
                await interaction.message.reply({
                    content: `${path[4] > 1 ? `${path[4]}x ` : ""}${
                        shopItems[path[3]].name
                    } acheté${path[4] > 1 ? "s" : ""} avec succès. (-${
                        shopItems[path[3]].price * path[4]
                    } :coin:)`,
                });
            } else {
                await interaction.reply({
                    content: "Echec. Vous n'avez pas assez de :coin:",
                    ephemeral: true,
                });
            }
        } else if (path[2] === "buyX") {
            const modalTitle = `Acheter plein de ${shopItems[path[3]].name}`;
            await interaction.showModal(
                new ModalBuilder()
                    .setCustomId(`cmd/shop/buyX/${path[3]}`)
                    .setTitle(
                        modalTitle.length > 45
                            ? `${modalTitle.substring(0, 42)}...`
                            : modalTitle
                    )
                    .addComponents(
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("buyQuantity")
                                .setLabel("Quantité")
                                .setPlaceholder("5")
                                .setMaxLength(6)
                                .setMinLength(1)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        )
                    )
            );
        }
    } else {
        interaction.reply({
            content:
                "Non, c'est pas ton shop, tu fais la commande /shop et tu utilises TON interface, merci ^^",
            ephemeral: true,
        });
    }
}

/**
 * Triggered when a modal is submitted
 * @param {ModalSubmitInteraction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 */
async function onModalSubmit(interaction, path) {
    if (path[2] === "buyX") {
        const quantity = interaction.components[0].components[0].value;

        if (isNaN(quantity)) {
            await interaction.reply({
                content: `Echec. "${quantity}" n'est pas un nombre.`,
                ephemeral: true,
            });
            return;
        }

        if (quantity < 0) {
            await interaction.reply({
                content: `Echec. La quantité doit être supérieur à 0.`,
                ephemeral: true,
            });
            return;
        }

        const buyCode = await interaction.user.buyItem(path[3], quantity);
        if (buyCode == 0) {
            await interaction.deferUpdate();
            shopDetails(interaction, path[3]);
            await interaction.message.reply({
                content: `${quantity > 1 ? `${quantity}x ` : ""}${
                    shopItems[path[3]].name
                } acheté${quantity > 1 ? "s" : ""} avec succès. (-${
                    shopItems[path[3]].price * quantity
                } :coin:)`,
            });
        } else {
            await interaction.reply({
                content: "Echec. Vous n'avez pas assez de :coin:",
                ephemeral: true,
            });
        }
    }
}

const definition = new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Commande d'achats");

module.exports = {
    onTrigger,
    definition,
    onButton,
    onModalSubmit,
};
