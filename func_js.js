window.all_operator = [];
var count = 0;

function add_operator()
{
	n = $("#dimension_n").val();
	eps = $("#input_eps").val();
	if (n == '')
	{
		alert("Введіть розмірність задачі");
	}

	if(eps == '')
	{
		alert("Введіть точність розв'язку");
	}

	table = "<div class = 'popup_for_table' style = 'display: block;'>";
	table += "<table class = 'value_operator'>"
	for(i=0; i<n; i++)
	{
		table += "<tr>"
			for(j = 0; j<n; j++)
			{
				table += "<td><input type = 'text' class = 'elem_operator'></td>"
			}
		table += "</tr>"
	}
	table += "<tr><td colspan = "+n/2+"><input type = 'button' value = 'Додати' onclick = 'add_value_operator("+n+")' class = 'add_one_operator'></td><td colspan = "+n/2+" class = 'add_one_operator'><input type = 'button' value = 'Відмінити' class = 'close' onclick = 'close_form_table(this);'></td></tr>"
	table +="</table>";
	table += "</div>";
	$(".operators .add_operator").before(table);
}
function write_operator(n, arr, c)
{
	operator = '';
	operator += '\\(A_{'+c+'} = ';
	operator += '\\begin{pmatrix}';
	for(i=0; i<n; i++)
	{
		for(j=0; j<n; j++)
		{
			if(j!==n-1)
				operator += arr[i][j]+'&';
			else
				operator += arr[i][j];
		}
		if(i !== n-1)
			operator += '\\\\'
	}
	operator += '\\end{pmatrix}\\),   ';
	$(".operators").before(operator);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
function add_value_operator(n)
{
	var operator_values = [];
	var td_operator = [];
	var exit = false;
	$(".value_operator input[type='text']").each(function(i){
		if($(this).val() == '')
		{
			alert("Введено порожнє значення. Виправте, будь ласка, дані. ");
			exit = true; 
			return false;
		}
		else if(isNaN(parseInt($(this).val(),10)))
		{
			alert("Введено не числове значення. Виправте, будь ласка, дані. ");
			exit = true; 
			return false;
		}
		else if((i+1)%n !== 0)
		{
			td_operator.push(parseFloat($(this).val()));
		}
		else
		{
			td_operator.push(parseFloat($(this).val()));
			operator_values.push(td_operator);
			td_operator = [];
		}
	});		
	if (!exit)
		$(".value_operator").remove();
	if(operator_values.length !== 0)
	{
		count++;
		dimension = $("#dimension_n").val();
		$(".dimension").html('<input style = "display:none" id = "dimension_n" value = "'+dimension+'">Задача розглядається в просторі \\(\\mathbb{R}^'+dimension+'\\).')
		write_operator(n, operator_values, count);
		window.all_operator.push(new Matrix({m : operator_values, n: dimension}));
	}
}

function close_form_table(element)
{
	$(element).parent().parent().parent().parent().parent().remove();
}
function edit_paralelepiped(n)
{
	str = '<p>Введіть довжини граней паралелепіпеда в просторі \\( \\mathbb{R}^'+n+' \\): </p>';
	for(i=1; i<=n; i++)
	{
		str += '<span>\\( x_{'+i+'} =  \\)</span><input type = "text" id = "paral_x'+i+'" value = "">, ';
	}

	str_x0 = '<p>Введіть координати початкового вектора  \\( x_0 \\): </p>';
	for(i=1; i<=n; i++)
	{
		str_x0 += '<span>\\( x_{'+i+'} =  \\)</span><input type = "text" id = "x0_x'+i+'" value = "">, ';
	}
	$('.paralelepiped').html(str);
	$(".value_x0").html(str_x0);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
function array_values()
{
	epsilon = parseFloat($("#input_eps").val());
	values = {};
	n = parseInt($("#dimension_n").val(),10);
	c = [];
	x0 = [];
	$(".paralelepiped input[type='text']").each(function(i){
        c[i] = parseFloat($(this).val());

    });
    for(i = 0; i<c.length; i++)
    {
		if(isNaN(c[i]))
		{
			alert("Заповніть, будь ласка, всі поля.");
			return;
		}
	}
    $(".value_x0 input[type='text']").each(function(i){
    	if(isNaN(parseFloat($(this).val())))
		{
			alert("Заповніть, будь ласка, всі поля.");
			return;
		}
		else
        x0[i] = parseFloat($(this).val());
    });
    for(j = 0; j<x0.length; j++)
    {
		if(isNaN(x0[j]))
		{
			alert("Заповніть, будь ласка, всі поля.");
			return;
		}
	}
   	if(window.all_operator.length == 0)
   	{
   		alert("Необхідно додати принаймні один оператор.");
   		return;
   	}

    values = {"n": n,"x0": x0,  "c": c, "eps" : epsilon, "all_operator" : window.all_operator};
    console.log(values);
    console.log(all_operator);
    onload_result(values);
}