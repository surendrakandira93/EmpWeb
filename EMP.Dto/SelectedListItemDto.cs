using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMP.Dto
{
    public class SelectedListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class SelectedListItemMvcDto
    {
        public string Value { get; set; }
        public string Text { get; set; }
    }
}
