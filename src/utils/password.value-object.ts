import { Result, ValueObject } from "..";
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import passwordGenerator, { ILength } from "./password-generator.util";
const regexHash = /^\$2b\$10\$.{53}$/;

export interface Prop {
	value: string;
}

export class PasswordValueObject extends ValueObject<Prop>{
	constructor(props: Prop){
		super(props)
	}

	/**
	 * @returns value as string
	 */
	get value(): string {
		return this.props.value;
	}

	/**
	 * 
	 * @description compare plainText with encrypted password
	 * @param plainText plainText not encrypted to compare with encrypted password
	 * @returns true if match else false
	 */
	public compare(plainText: string): boolean {
		if (PasswordValueObject.isEncrypted(this.props.value)) {
			return	compareSync(plainText, this.props.value);
		}
		return plainText === this.props.value;
	}

	/**
	 * 
	 * @returns true if instance value is encrypted else false
	 */
	public isEncrypted(): boolean {
		return regexHash.test(this.props.value);
	}

	/**
	 * 
	 * @returns true if instance value is encrypted else false
	 */
	public static isEncrypted(value: string): boolean {
		return regexHash.test(value);
	}

	/**
	 * 
	 * @param length password length as number 8/10/12/14/16/18
	 * @returns PasswordValueObject
	 */
	public static generateRandomPassword(length: ILength): PasswordValueObject {
		return PasswordValueObject.create(passwordGenerator(length)).getResult();
	}

	/**
	 * @description encrypt value of instance
	 */
	public encrypt(): void {
		const salt = genSaltSync();
		this.props.value = hashSync(this.props.value, salt);
	}

	/**
	 * 
	 * @param value check if password has a valid value length
	 * @returns true if is all ok or false else not
	 */
	public static isValidValue(value: string): boolean {
		const maxLength = 21;
		const minLength = 5;
		if (!PasswordValueObject.isEncrypted(value)) {
			const passwordHasRequiredLength = value.length >= minLength && value.length <= maxLength;
			return passwordHasRequiredLength;
		}
		return true;
	}

	/**
	 * 
	 * @param value password to create
	 * @returns Result of PasswordValueObject
	 */
	static create(value: string): Result<PasswordValueObject>{
		if (!PasswordValueObject.isValidValue(value)){
			return Result.fail<PasswordValueObject>('Password must has min 5 and max 21 chars');
		}
		return Result.ok<PasswordValueObject>(new PasswordValueObject({value}));
	}
}
