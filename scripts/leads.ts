import { writeFileSync, realpathSync } from "node:fs";
import { isAbsolute, relative, dirname, resolve, basename } from "node:path";
import { leadOperations, notifyLead } from "../src/lib/leads";
async function main() {
  const [command, id, destination] = process.argv.slice(2);
  const operations = leadOperations();
  try {
    if (command === "list")
      console.log(JSON.stringify(operations.list(), null, 2));
    else if (
      command === "export" &&
      id &&
      destination &&
      isAbsolute(destination) &&
      relative(process.cwd(), destination).startsWith("..")
    ) {
      const directory = realpathSync(dirname(destination));
      const location = relative(realpathSync(process.cwd()), directory);
      if (location !== ".." && !location.startsWith("../"))
        throw Error("Export must be outside the project");
      writeFileSync(
        resolve(directory, basename(destination)),
        JSON.stringify(operations.export(id), null, 2),
        { mode: 0o600, flag: "wx" },
      );
      console.log("Private export saved.");
    } else if (command === "delete" && id)
      console.log(JSON.stringify({ deleted: operations.remove(id) }));
    else if (
      command === "requeue" &&
      id &&
      destination === "--confirmed-not-sent"
    )
      console.log(JSON.stringify({ requeued: operations.requeue(id) }));
    else if (command === "resolve-sent" && id && destination)
      console.log(
        JSON.stringify({ resolved: operations.resolveSent(id, destination) }),
      );
    else if (command === "purge" && id && /^\d+$/.test(id) && Number(id) >= 1)
      console.log(JSON.stringify({ deleted: operations.purge(Number(id)) }));
    else if (command === "retry" && id)
      console.log(JSON.stringify({ notification: await notifyLead(id) }));
    else
      throw Error(
        "Usage: pnpm leads list | export ID /private/absolute/file.json | retry ID | delete ID",
      );
  } finally {
    operations.close();
  }
}
main().catch(() => {
  console.error(
    "Operation failed. Check storage configuration, command arguments and private destination permissions.",
  );
  process.exitCode = 1;
});
