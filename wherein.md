<h1>Generate SQL "where-in" from multiple lines of text</h1>
<input type="checkbox" id="isNumeric" /> Treat as numeric<br />

<p>Paste your excel column here:</p>
<textarea rows="20" cols="80" id="input"></textarea>

<textarea rows="10" cols="160" id="output"></textarea>

<script type="text/javascript">
	var txtInput = document.getElementById("input");
	var txtOutput = document.getElementById("output");
	var chkIsNumeric = document.getElementById("isNumeric");

	txtInput.addEventListener("change", handleInput);
	txtInput.addEventListener("input", handleInput);

	function handleInput() {
		var isNumeric = chkIsNumeric.checked;
		var buffer = "";
		var input = textarea.value.split("\n");
		var buffer = "where X in (";
		input = input.map((line) => {
			return isNumeric ? line.trim() : "'" + line.trim() + "'";
		});
		buffer = buffer + input.join(",") + ")";
		txtOutput.value = buffer;
	}
</script>
