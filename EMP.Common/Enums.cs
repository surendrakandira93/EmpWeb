using System;
using System.Collections.Generic;
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
    public enum InviteType
    {
        Invite = 1,
        Pending = 2,
        Accepted = 3,
        Rejected = 4
    }
}
