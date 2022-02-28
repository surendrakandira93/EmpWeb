using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
   public class SchemeProfitLossSummaryDto
    {
        public double RealisedPL { get; set; }
        public double Charge { get; set; }
        public double NetRealisedPL { get; set; }
        public double UnRealisedPL { get; set; }
    }
}
