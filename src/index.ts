import { Events, GatewayIntentBits } from "discord.js";
import { token } from "../config";
import { BotClient } from "./OverridedClasses/BotClient";
import { Boot } from "./utils/Boot";
import { FunctionsForEvents } from "./utils/interaction.event";
import "reflect-metadata";

const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

Boot.loadCommands(client);
Boot.deployCommands(false);
client.on(Events.InteractionCreate, FunctionsForEvents.interaction);
client.on(Events.InviteCreate, FunctionsForEvents.inviteIsCreated);
client.once(Events.ClientReady, FunctionsForEvents.clientReady);

client.login(token);