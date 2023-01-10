const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // Create a 700x250 pixel canvas and get its context
    // The context will be used to modify the canvas
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage("./back.png");

    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set the color of the stroke
    context.strokeStyle = "#ae00ff";

    // Draw a rectangle with the dimensions of the entire canvas
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    context.font = "28px sans-serif";
    context.fillStyle = "#ffffff";
    context.fillText(
        "Profil de " + interaction.member.displayName,
        canvas.width / 2.5,
        canvas.height / 3.5
    );

    // Pick up the pen
    context.beginPath();

    // Start the arc to form a circle
    context.arc(125, 125, 100, 0, Math.PI * 2, true);

    // Put the pen down
    context.closePath();

    // Clip off the region you drew on
    context.clip();

    // Using undici to make HTTP requests for better performance
    const { body } = await request(
        interaction.user.displayAvatarURL({
            extension: "jpg",
        })
    );
    const avatar = await Canvas.loadImage(await body.arrayBuffer());

    // Move the image downwards vertically and constrain its height to 200, so that it's square
    context.drawImage(avatar, 25, 25, 200, 200);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "profile-image.png",
    });

    interaction.reply({ files: [attachment] });
}

const definition = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test");

module.exports = {
    trigger,
    definition,
};
