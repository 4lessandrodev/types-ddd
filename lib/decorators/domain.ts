let count = 0;
function increment() {
	count++;
	return count;
}

function PropertyDecorator(
	target: any,
	propertyKey: string,
	descriptor?: PropertyDescriptor
) {
	console.log(
		increment(),
		'PropertyDecorator called on',
		target.constructor.name,
		' on property key',
		propertyKey,
		'descriptor:',
		descriptor,
		'\n'
	);
}

function PropertyDecoratorFactory(message: string) {
	return (target: any, propertyKey: string) => {
		console.log(
			increment(),
			'PropertyDecoratorFactory called for',
			target.constructor.name,
			' on property key',
			propertyKey,
			'message: ',
			message,
			'\n'
		);
	};
}

export function ClassDecorator(constructor: Function): void {
	console.log(
		increment(),
		'ClassDecorator called for',
		constructor.name,
		'\n'
	);
}

export function ClassDecoratorFactory(message: string) {
	return (constructor: Function): void => {
		console.log(
			increment(),
			'ClassDecoratorFactory called for',
			constructor.name,
			'with argument',
			message,
			'\n'
		);
	};
}

@ClassDecorator
@ClassDecoratorFactory('UserEntity')
class User {
	@PropertyDecoratorFactory('ValueObject')
	name!: string;

	@PropertyDecorator
	age!: number;
}

const user = new User();
console.log(user);
