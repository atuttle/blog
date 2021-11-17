const { DateTime } = require("luxon");

module.exports = {
	getWebmentionsForUrl: (webmentions, url) => {
		return webmentions.children.filter((entry) => entry["wm-target"] === url);
	},
	size: (mentions) => {
		return !mentions ? 0 : mentions.length;
	},
	webmentionsByType: (mentions, mentionType) => {
		const types = isArray(mentionType) ? mentionType : [mentionType];
		return mentions.filter((entry) =>
			types.reduce((found, t) => !!entry[t] || found, false)
		);
	},
	readableDateFromISO: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => {
		return DateTime.fromISO(dateStr).toFormat(formatStr);
	},
};

var toString = {}.toString;
const isArray =
	Array.isArray ||
	function (arr) {
		return toString.call(arr) === "[object Array]";
	};
