import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class StudentDto {
    @ApiProperty({ type: String, example: 'Robert', required: true })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ type: String, example: 'John'})
    @IsString()
    lastName: string;

    @ApiProperty({ type: String, example: 'robert@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({ type: String, example: 'Password123@' })
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @ApiProperty({ type: String, example: '+12243238312'})
    @IsMobilePhone()
    mobileNumber: string;

}