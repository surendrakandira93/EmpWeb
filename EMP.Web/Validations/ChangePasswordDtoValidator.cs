using EMP.Dto;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMP.Web.Validations
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(l => l.CurrentPassword).NotNull().WithMessage("*required");
            RuleFor(l => l.Password).NotNull().WithMessage("*required").NotEqual(x => x.CurrentPassword).WithMessage("Current Password and new Password should be different"); ;
            RuleFor(l => l.ConfirmPassword).NotNull().WithMessage("*required").Equal(x => x.Password).WithMessage("Confirm Password not matched with Password");
        }
    }
}