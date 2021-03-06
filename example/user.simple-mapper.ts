import {
	IMapper,
	DomainId,
	BirthdayValueObject,
	EmailValueObject,
	UserNameValueObject,
	PasswordValueObject,
	ChangesObserver,
} from '@types-ddd';
import { User } from './simple-user.aggregate';

// ----------------------------------------------------------------------------
// User to persist on database
class Model {
	id!: string;
	userName!: string;
	userEmail!: string;
	userBirthDay!: Date;
	userPassword!: string;
	createdAt!: Date;
	updatedAt!: Date;
}

// ----------------------------------------------------------------------------
// Mapper to be injected on repository. Marked as deprecated. Use TMapper instead IMapper. @see user.tmapper.ts
export class UserMapper implements IMapper<User, Model> {
	//
	toDomain(model: Model): User {
		const nameOrError = UserNameValueObject.create(model.userName);
		const emailOrError = EmailValueObject.create(model.userEmail);
		const passOrError = PasswordValueObject.create(model.userPassword);
		const birthOrError = BirthdayValueObject.create(model.userBirthDay);

		const observer = ChangesObserver.init<unknown>();

		observer.add(nameOrError);
		observer.add(emailOrError);
		observer.add(passOrError);
		observer.add(birthOrError);

		const result = observer.getResult();

		if (result.isFailure) {
			throw new Error(`Error on UserMapper: ${result.errorValue()}`);
		}

		const user = User.create({
			ID: DomainId.create(model.id),
			userName: nameOrError.getResult(),
			userEmail: emailOrError.getResult(),
			userPassword: passOrError.getResult(),
			userBirthDay: birthOrError.getResult(),
			createdAt: model.createdAt,
			updatedAt: model.updatedAt,
		});

		return user.getResult();
	}
	toPersistence = (aggregate: User): Model => ({
		id: aggregate.id.value.toString(),
		userName: aggregate.userName.value,
		userEmail: aggregate.userEmail.value,
		userPassword: aggregate.userPassword.value,
		userBirthDay: aggregate.userBirthDay.value,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
	});
}
