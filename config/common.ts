export const CommonConfig = {
	hostname: "127.0.0.1",
	port: 8080,

	bot: {
		name: "ykunbot",
		token: Deno.env.get("BOT_TOKEN"),
	},

	organization: {
		name: "studyrs",
		teams: {
			"approvers": "rustt-approvers",
		},
	},

	repository: "Rustt",
};
