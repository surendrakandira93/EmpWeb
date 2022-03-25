using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Common
{
    public enum MessageType
    {
        Warning,
        Success,
        Danger,
        Info
    }

    public enum ModalSize
    {
        Small,
        Large,
        Medium,
        XLarge
    }
    public enum InviteType
    {
        Invite = 1,
        Pending = 2,
        Accepted = 3,
        Rejected = 4
    }

    public enum Brokers
    {
        [Display(Name ="Brokers")]
        Brokers = 1,
        [Display(Name = " ICICI Direct")]
        ICICIDirect = 2,
        [Display(Name = "Sharekhan")]
        Sharekhan = 3,
        [Display(Name = "Reliance Securities")]
        RelianceSecurities = 4,
        [Display(Name = "Religare Online")]
        RelianceOnline = 5
    }

}
