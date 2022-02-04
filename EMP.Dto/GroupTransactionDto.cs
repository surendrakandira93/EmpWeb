using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class GroupTransactionDto
    {
        public string Product { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime ExistDate { get; set; }
        public int Qty { get; set; }
        public double Price { get; set; }
    }
}
