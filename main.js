
function round_number(n,a)
{
	x = Math.pow(10,a);
	return Math.floor(n*x+0.5)/x;
}
function sign(a)
{
	if (a<0) return -1
	else return 1	
}
//клас для роботи з матрицею
function Matrix(values)
{
	values = values || {};
	var a = values.a || 2;
	var n = values.n || 3;
	var m = values.m || false;
	this.n = n;
	this.a = a;
	this.m = m;
	//функція для генерування матриці - на діагоналі 0, під діагоналлю задане в кострукторі значення а, під діагоналлю - (-а)
	this.generate = function()
	{
		Mass = [];
		for(i=0;i<this.n;i++)
		{
			Mass[i] = [];
			for(j=0;j<this.n;j++)
			{
				if(i==j)
					Mass[i][i] = 0;
				else if(i>j)
					Mass[i][j]=this.a;
				else
					Mass[i][j]=-this.a
			}
		}
		this.m = Mass;
	}
	if(!m)
		this.generate();
	//функція додавання матриць
	this.add = function(b)
	{
		var res;
		if(this.n!=b.n||this.n<=0) return res;
		res = new Matrix({n: this.n});
		res.m = [];
		for(i=0;i<this.n;i++)
		{
			res.m[i] = [];
			for(j=0;j<this.n;j++)
			{
				res.m[i][j] = this.m[i][j]+b.m[i][j];
			}
		}
		return res;
	}
	//функція віднімання матриць
	this.substr = function(b)
	{
		var res;
		if(this.n!=b.n||this.n<=0) return res;
		res = new Matrix({n: this.n});
		res.m = [];
		for(i=0;i<this.n;i++)
		{
			res.m[i] = [];
			for(j=0;j<this.n;j++)
			{
				res.m[i][j] = this.m[i][j]-b.m[i][j];
			}
		}
		return res;
	}
	// функція множення матриць
	this.mult = function(b)
	{
		var res;
		if(this.n!=b.n||this.n<=0) return res;
		res = new Matrix({n: b.n});
		res.n = this.n;
		res.m = [];
		for(i=0;i<this.n;i++)
		{
			res.m[i] = [];
			for(j=0;j<this.n;j++)
			{
				res.m[i][j] = 0;
				for(h=0;h<this.n;h++)
					{res.m[i][j] = res.m[i][j] + this.m[i][h]*b.m[h][j];}
			}
		}
		return res;
	}
	//функція множення матриці на скаляр
	this.mult_matrix_by_scalar = function(p)
	{
		x = this;
		for(i=0;i<this.n;i++)
			for(j=0;j<this.n;j++)
				x.m[i][j] = x.m[i][j]*p;
		return x;
	}
	// функція присвоєння матриці 
	this.assign = function(b)
	{

		for(i=0;i<b.n;i++)
		{
			for(j=0;j<b.n;j++)
				this.m[i][j] = b.m[i][j];
		}
		return this;
	}
	//функція отримання транспонованої матриці
	this.transpose = function()
	{
		var x = new Matrix({n: this.n});
		x.assign(this);
		var t = 0;
		for(i=0;i<this.n-1;i++)
		{
			for(j=i+1;j<this.n;j++)
			{
				t = x.m[i][j];
				x.m[i][j] = x.m[j][i];
				x.m[j][i] = t;
			}
		}
		return x;
	}
	//знаходження максимального власного числа матриці
	this.lambda_max = function(eps)
	{
		n = this.n;
		f = new Vector(n);
		var mu,mu1,sum,norm = 0; 
		sum = 0;
		mu = 0;
		mu1 = 0;
		x1 = new Vector(n);
		do
		{
			for(i=0; i<n;i++)
			{
				x1.v[i] = 0;
				for(j=0;j<n;j++)
				{
					x1.v[i] = x1.v[i]+this.m[i][j]*f.v[j]
				}
			}
			mu = mu1;
			mu1 = x1.v[0]/f.v[0];
			f.assign(x1);
		}
		while(Math.abs(mu1-mu)>eps);
		return mu1;
	}
	// обчислення евклідової норми матриці
	this.norma_matrix = function(eps)
	{
		n = this.n;
		r = new Matrix({n: n});
		r = this.transpose();
		r.assign(r.mult(this));
		l = r.lambda_max(eps);
		norma = Math.sqrt(l);
		return norma;
	}
}


// клас для роботи з векторами
function Vector(n,a)
{
	if(a == undefined)
		a=1;
	if(n == undefined)
		n=3;
	this.n = n;
	this.a = a;
	// задаємо початковий вектор
	this.start_vector = function()
	{
		Mass = [];
		for(i=0;i<this.n;i++)
			Mass[i] = this.a;
		this.v = Mass;
	}
	this.start_vector();
	// присвоювання вектора
	this.assign = function(b)
	{
		this.n = b.n;
		for(i=0;i<this.n;i++)
			this.v[i] = b.v[i];
		return this;
	}
	// множення вектора на матрицю
	this.mult_by_matrix = function(a)
	{
		var i,j;
		res = new Vector(this.n);
		res.v = [];
		for(i=0;i<this.n;i++)
		{
			res.v[i] = 0;
			for(j=0;j<this.n;j++)
			{
				res.v[i] = res.v[i]+this.v[j]*a.m[i][j];
			}
		}
		return res;
	}
	// функція додавання векторів
	this.add = function(a)
	{
		var res;
		if (this.n != a.n || this.n<=0) return res;
		res = new Vector(this.n);
		res.v = [];
		for(i=0;i<this.n;i++)
			res.v[i] = this.v[i] + a.v[i];
		return res;
	}
	// функція віднімання векторів
	this.substr = function(a)
	{
		var res;
		if (this.n != a.n || this.n<=0) return res;
		res = new Vector(this.n);
		res.v = [];
		for(i=0;i<this.n;i++)
			res.v[i] = this.v[i] - a.v[i];
		return res;
	}
	// обчислення скалярного добутку векторів
	this.scalar = function(a)
	{
		var res = 0;
		for(i=0;i<this.n;i++)
		{
			res = res + this.v[i]*a.v[i];
		}
		return res;
	}
	// множення вектора на скаляр
	this.mult_by_scalar = function(k)
	{
		res = new Vector(this.n);
		for(i=0;i<this.n;i++)
			res.v[i] = this.v[i]*k;
		return res;
	}
	//обчислення евклідової норми вектора
	this.norma = function()
	{
		var norm = 0;
		norm = Math.sqrt(this.scalar(this));
		return norm;
	}
	this.abs = function()
	{
		n = this.n;
		res = new Vector(n);
		res.v = [];
		var i;
		for(i=0;i<n;i++)
		{
			if(this.v[i]<0)
				res.v[i] = -this.v[i]
			else
				res.v[i] = this.v[i];
		}
		return res;
	}
	this.greater = function(eps) 
	{
		n = this.n;
		var s=0;
		for(i=0;i<n;i++)
		{	
			var k=0;
			if (this.v[i]<eps)
				k=1;
			if(k==1)
				s=s+1;
		}
		if(s==0)
			return true
		else return false;
	}
	this.modul = function(a)
	{
		var res = 0;
		if (this.n!=a.n)
			return 'error';
		var i=0;
		var n = this.n;

		for(i=0;i<n;i++)
		{
			res = res + Math.pow(this.v[i]-a.v[i],2)
		}
		return Math.sqrt(res);
	}
}
function proection(p,c)
{
	var r = new Vector(p.n);
	if (p.n != c.length)
		r='error';
	for(i=0;i<p.n;i++)
	{
		if (p.v[i]<0)
			{r.v[i]=0;}
		else if (p.v[i]>c[i])
			{r.v[i]=c[i];}
		else r.v[i]=p.v[i]

	}
	return r;
}
function double_print(a,b)
{
	this.a = a;
	this.b = b;
}
function Korpolevich(a,x,c,eps)
{
	if (a.n!=x.n)
		return 'error';
	var x0 = new Vector(x.n);
	var y = new Vector(x.n);
	var lambda = 0;
	var i = 0;
	var norm_a = 0;
	norm_a = a.norma_matrix(eps);
	lambda = 1/(2*norm_a);
	draw_point(x.v[0],x.v[1],x.v[2],0x000000)
	while(x.modul(x0)>eps)
	{
		x0.assign(x);
		y = x0.mult_by_matrix(a);
		y = y.mult_by_scalar(lambda);
		y.assign(proection(x0.substr(y),c));
		x = y.mult_by_matrix(a);
		x=x.mult_by_scalar(lambda);
		x = proection(x0.substr(x),c);
		draw_point(x.v[0],x.v[1],x.v[2],0xff0000)
		draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
		i++;

	}
	draw_cube(c);
	var output = new double_print(x,i);
	return output;
}

function Popov(a,x,c,eps)
{
	if (a.n!=x.n)
		return 'error';
	var x0 = new Vector(x.n);
	var y = new Vector(x.n);
	var lambda = 0;
	var i = 0;
	var norm_a = 0;
	norm_a = a.norma_matrix(eps);
	lambda = 1/(3*norm_a);
	draw_point(x.v[0],x.v[1],x.v[2],0x000000)
	while(x.modul(x0)>eps)
	{
		x0.assign(x);
		y = x0.mult_by_matrix(a);
		y = y.mult_by_scalar(lambda);
		y.assign(proection(x0.substr(y),c));
		x = y.mult_by_matrix(a);
		x=x.mult_by_scalar(lambda);
		x = proection(x0.substr(x),c);
		draw_point(x.v[0],x.v[1],x.v[2],0xff0000)
		draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
		i++;
	}
	draw_cube(c);
	var output = new double_print(x,i);
	return output;
}
function Popov_system(a,x,c,eps,lambda_max)
{
	count = a.length;
	draw = false;
	if(x.n == 3)
		draw = true;
	for(i=0; i<count; i++)
	{
		if (a[i].n!=x.n)
			return 'error';
	}
	var x0_main = new Vector(x.n);
	var x0 = new Vector(x.n);
	var y = new Vector(x.n);
	var lambda = 0;
	var norm_a = 0;
	var arr_lambda = [];
	for (k=0; k<count; k++)
	{
		arr_lambda[k] = 1/(3*a[k].norma_matrix(eps));
	}
	norm_a = a[0].norma_matrix(eps);
	for (t=1; t<count; t++)
	{
		new_norma_matrix = a[t].norma_matrix(eps);
		if(new_norma_matrix>norm_a)
		{
			norm_a = new_norma_matrix;
		}
	}
	var i = 0;
	lambda = 1/(3*norm_a);
	if(draw)
		draw_point_start(x.v[0],x.v[1],x.v[2],0x000000);
	while(x.modul(x0_main)>eps)
	{
		x0_main.assign(x);
		for(j=0; j<count; j++)
		{
			if(!lambda_max)
				lambda = arr_lambda[j];
			x0.assign(x);
			y = x0.mult_by_matrix(a[j]);
			y = y.mult_by_scalar(lambda);
			y.assign(proection(x0.substr(y),c));
			x = y.mult_by_matrix(a[j]);
			x=x.mult_by_scalar(lambda);
			x = proection(x0.substr(x),c);
			if(draw)
			{
				if(i<30)
				{
					draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
					draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0bda51);
				}
				else if(i%50 == 0)
				{
					draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
					draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0bda51);
				}
			}
		}
		i++;
	}
	if(draw)
		draw_cube(c);
	var output = new double_print(x,i);
	return output;
}
function middle_value_vector(arr_x)
{
	count = arr_x.length;
	var sum = [];
	x = new Vector(arr_x[0].length);
	for(j=0; j<arr_x[0].length; j++)
	{ 
		sum[j]=0
		for(i = 0; i<count; i++)
		{
			sum[j] += arr_x[i][j];
		}
		sum[j] = sum[j]/count;
	}
	x.v = sum;
	return x;
}
function Popov_system_middle_value(a,x,c,eps, lambda_max)
{
	count = a.length;
	draw = false;
	if(x.n == 3)
		draw = true;
	for(i=0; i<count; i++)
	{
		if (a[i].n!=x.n)
			return 'error';
	}
	var x0_main = new Vector(x.n);
	var x0 = new Vector(x.n);
	var y = new Vector(x.n);
	var lambda = 0;
	var norm_a = 0;
	var arr_lambda = [];
	var arr_result = [];
	var arr_points = [];
	for (k=0; k<count; k++)
	{
		arr_lambda[k] = 1/(3*a[k].norma_matrix(eps));
	}
	norm_a = a[0].norma_matrix(eps);
	for (i=1; i<count; i++)
	{
		new_norma_matrix = a[i].norma_matrix(eps);
		if(new_norma_matrix>norm_a)
		{
			norm_a = new_norma_matrix;
		}
	}
	var i = 0;
	lambda = 1/(3*norm_a);
	if(draw)
		draw_point_start(x.v[0],x.v[1],x.v[2],0x000000);
	arr_points.push(x.v);
	while(x.modul(x0)>eps)
	{
		x0.assign(x);
		for(j=0; j<count; j++)
		{
			if(!lambda_max)
				lambda = arr_lambda[j];
			y = x0.mult_by_matrix(a[j]);
			y = y.mult_by_scalar(lambda);
			y.assign(proection(x0.substr(y),c));
			x = y.mult_by_matrix(a[j]);
			x=x.mult_by_scalar(lambda);
			x = proection(x0.substr(x),c);
			
			arr_result[j] = x.v;
		}
		x = middle_value_vector(arr_result);
		if(i<30)
		{
			arr_points.push(x.v);
		}
		else if(i%50 == 0)
		{
			arr_points.push(x.v);
		}
		i++;
	}
	if(draw)
	{
		for(p = 1; p<arr_points.length; p++)
		{	
			draw_point(arr_points[p][0],arr_points[p][1],arr_points[p][2],0x000000);
			draw_line(arr_points[p-1][0],arr_points[p-1][1],arr_points[p-1][2],arr_points[p][0],arr_points[p][1],arr_points[p][2],0xf984e5);
		}
		draw_cube(c);
	}
	var output = new double_print(x,i);
	return output;
}

function Popov_system_modification(a,x,c,eps)
{
	count = a.length;
	draw = false;
	if(x.n == 3)
		draw = true;
	for(i=0; i<count; i++)
	{
		if (a[i].n!=x.n)
			return 'error';
	}
	console.log(x.v);
	var alpha0 = 0.8/0.9;
	var alpha = 0;
	var lambda = 0;
	var x0_main = new Vector(x.n);
	var x0 = new Vector(x.n);
	var y = new Vector(x.n);
	var norm_a = 0;
	var arr_lambda = [];
	var arr_alpha = [];
	var arr_result = [];
	var arr_points = [];
	for (k=0; k<count; k++)
	{
		arr_lambda[k] = 1/(2*a[k].norma_matrix(eps));
		arr_alpha[k] = Math.min(alpha0, arr_lambda[k]);
	}
	norm_a = a[0].norma_matrix(eps);
	for (i=1; i<count; i++)
	{
		new_norma_matrix = a[i].norma_matrix(eps);
		if(new_norma_matrix>norm_a)
		{
			norm_a = new_norma_matrix;
		}
	}
	var i = 0;
	lambda = 1/(3*norm_a);
	if(draw)
		draw_point_start(x.v[0],x.v[1],x.v[2],0x000000);
	arr_points.push(x.v);
	while(x.modul(x0)>eps)
	{
		x0.assign(x);
		for(j=0; j<count; j++)
		{
			alpha = arr_alpha[j];
			lambda = arr_lambda[j];
			y = x0.mult_by_matrix(a[j]);
			y = y.mult_by_scalar(lambda);
			y.assign(proection(x0.substr(y),c));
			sub_y=y.substr(x0);
			a_x0 = x0.mult_by_matrix(a[j]);
			a_y = y.mult_by_matrix(a[j]);
			sub_a = a_y.substr(a_x0);
			if(sub_a.norma()!=0)
				alpha = Math.min(lambda,alpha0*(sub_y.norma()/sub_a.norma()));
			x = y.mult_by_matrix(a[j]);
			x = x.mult_by_scalar(lambda);
			x = proection(x0.substr(x),c);
			
			// arr_result[j] = x.v;
			// if(draw)
			// {
			// 	if(i<30)
			// 	{
			// 		draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
			// 		draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
			// 	}
			// 	else if(i%50 == 0)
			// 	{
			// 		draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
			// 		draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
			// 	}
			// }
		}

		if(draw)
		{	
			if(i<30)
			{
				draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
				draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
			}
			else if(i%50 == 0)
			{
				draw_point(x.v[0],x.v[1],x.v[2],0xff0000);
				draw_line(x0.v[0],x0.v[1],x0.v[2],x.v[0],x.v[1],x.v[2],0x0047ab);
			}
		}
		// x = middle_value_vector(arr_result);
		// if(i<30)
		// {
		// 	arr_points.push(x.v);
		// }
		// else if(i%50 == 0)
		// {
		// 	arr_points.push(x.v);
		// }
		i++;
	}
	if(draw)
	{
		// for(p = 1; p<arr_points.length; p++)
		// {	
		// 	draw_point(arr_points[p][0],arr_points[p][1],arr_points[p][2],0x000000);
		// 	draw_line(arr_points[p-1][0],arr_points[p-1][1],arr_points[p-1][2],arr_points[p][0],arr_points[p][1],arr_points[p][2],0x0047ab);
		// }
		draw_cube(c);
	}
	var output = new double_print(x,i);
	return output;
}

function modification_extra_gradient(a,u,c,eps)
{
	if (a.n!=u.n)
		return 'error';
	var alpha0 = 0.8/0.9;
	var alpha = 0;
	var lambda = 0;
	var norm_a = a.norma_matrix(eps);
	lambda = 1/(2*norm_a);
	alpha = Math.min(alpha0,lambda);
	var u1 = new Vector(u.n);
	var u0 = new Vector(u.n);
	var i = 0;
	draw_point(u.v[0],u.v[1],u.v[2],0x000000)
	while(u.modul(u0)>eps)
	{
		u0.assign(u);
		u1 = u0.mult_by_matrix(a);
		u1 = u1.mult_by_scalar(alpha);
		u1 = proection(u0.substr(u1),c);
		sub_u=u0.substr(u1);
		a_u0 = u0.mult_by_matrix(a);
		a_u1 = u1.mult_by_matrix(a);
		sub_a = a_u0.substr(a_u1);
		if(sub_a.norma()!=0)
			alpha = Math.min(lambda,alpha0*(sub_u.norma()/sub_a.norma()));
		u = u1.mult_by_matrix(a);
		u = u.mult_by_scalar(alpha);
		u = proection(u0.substr(u),c);
		draw_point(u.v[0],u.v[1],u.v[2],0x0000ff);
		draw_line(u0.v[0],u0.v[1],u0.v[2],u.v[0],u.v[1],u.v[2],0xff9900);
		i++
	}
	draw_cube(c);
	var output = new double_print(u,i);
	return output;
}
//POMYLKA!!!!!!!!!!!!!!!!!!!
// function extra_gradient(a,z,c,eps)
// {
// 	var z0 = new Vector(z.n);
// 	var z1 = new Vector(z.n);
// 	var z2 = new Vector(z.n);
// 	var lambda = 0;
// 	var i = 0;
// 	var norm_a = 0;
// 	norm_a = a.norma_matrix(eps);
// 	lambda = 1/(8*norm_a);
// 	while(i<10)
// 	{
// 		z0.assign(z);
// 		z1 = z0.mult_by_matrix(a);
// 		z1 = z1.mult_by_scalar(lambda);
// 		z1 = proection(z0.substr(z1),c);
// 		z2 = z1.mult_by_matrix(a);
// 		z2 = z2.mult_by_scalar(lambda);
// 		z2 = proection(z1.substr(z2),c);
// 		z = z2.mult_by_matrix(a);
// 		z = z.mult_by_scalar(lambda);
// 		z = proection(z0.substr(z),c);
// 		draw_point(z.v[0],z.v[1],z.v[2],0x000000);
// 		draw_line(z0.v[0],z0.v[1],z0.v[2],z.v[0],z.v[1],z.v[2],0x0bda51);
// 		i++;
// 	}
// 	draw_cube(c);
// 	var output = new double_print(z,i);
// 	return output;
// }


a = new Matrix()
x = new Vector()
c = [1,2,3]
eps = 0.00001
