import { Events, GatewayIntentBits } from "discord.js";
import { token } from "../config";
import { BotClient } from "./OverridedClasses/BotClient";
import { Boot } from "./utils/Boot";
import {FunctionsForEvents} from "./utils/interaction.event";


const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

Boot.loadCommands(client);
client.on(Events.InteractionCreate, FunctionsForEvents.interaction);
client.once(Events.ClientReady, FunctionsForEvents.clientReady);

client.login(token);