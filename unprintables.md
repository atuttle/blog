<h1>Find Unprintables</h1>
<p>Paste your content here:</p>
<textarea rows="20" cols="80" id="input"></textarea>
<table id="output"></table>

<script type="text/javascript">
	var textarea = document.getElementById("input");
	var table = document.getElementById("output");

	textarea.addEventListener("change", handleInput);
	textarea.addEventListener("input", handleInput);

	function handleInput() {
		var buffer = "";
		var input = textarea.value.split("");
		input.forEach(function (char) {
			var charcode = char.charCodeAt(0);
			var rowstyle = "";
			if (charcode < 32 || charcode > 126) {
				if (charcode === 10 || charcode === 13) {
					rowstyle = "background-color: #eae300;";
				} else {
					rowstyle = "background-color: #ea3600";
				}
			} else {
				rowstyle = "";
			}
			buffer +=
				'<tr style="' +
				rowstyle +
				'"><td>' +
				char +
				"</td><td>" +
				charcode +
				"</td></tr>";
		});

		table.innerHTML = buffer;
	}
</script>
