<h1>Generate SQL "where-in" from multiple lines of text</h1>

<label>
	<input type="checkbox" id="isNumeric" />
	Treat as numeric
</label>
<br />

<p>Paste your excel column here:</p>
<textarea rows="15" cols="50" id="input"></textarea>
<br/>
<br/>

<button type="button" id="btnCopy">📋 Copy generated code to clipboard</button>
<br/>
<textarea rows="15" cols="100" id="output"></textarea>

<script type="text/javascript">
	var txtInput = document.getElementById("input");
	var txtOutput = document.getElementById("output");
	var chkIsNumeric = document.getElementById("isNumeric");
	var btnCopy = document.getElementById("btnCopy");

	btnCopy.addEventListener("click", function () {
		var copyText = txtOutput.value;
		navigator.clipboard.writeText(copyText);
	});

	chkIsNumeric.addEventListener("change", handleInput);
	chkIsNumeric.addEventListener("click", handleInput);
	txtInput.addEventListener("change", handleInput);
	txtInput.addEventListener("input", handleInput);

	function handleInput() {
		var isNumeric = chkIsNumeric.checked;
		var buffer = "where X in (";
		var input = txtInput.value.split("\n").map((line) => {
			return isNumeric ? line.trim() : "'" + line.trim() + "'";
		});
		buffer = buffer + input.join(",") + ")";
		txtOutput.value = buffer;
	}
</script>
