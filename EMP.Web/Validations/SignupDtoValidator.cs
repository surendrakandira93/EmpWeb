using EMP.Dto;
using FluentValidation;

namespace EMP.Web.Validations
{
    public class SignupDtoValidator : AbstractValidator<SignupDto>
    {
        public SignupDtoValidator()
        {
            RuleFor(l => l.Name).NotNull().WithMessage("*required");
            RuleFor(l => l.DateOfBrith).NotNull().WithMessage("*required");
            RuleFor(l => l.Email).EmailAddress().WithMessage("Invalid email").NotNull().WithMessage("*required");
            RuleFor(l => l.Password).NotNull().WithMessage("*required").Length(5, 15);
            RuleFor(l => l.ConfirmPassword).NotNull().WithMessage("*required").Equal(x => x.Password).WithMessage("Confirm Password not matched with Password");
        }
    }
}
