using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace EMP.Common
{
    public static class Extensions
    {

        #region "Dictionary"

        public static void AddOrReplace(this IDictionary<string, object> DICT, string key, object value)
        {
            if (DICT.ContainsKey(key))
                DICT[key] = value;
            else
                DICT.Add(key, value);
        }

        public static dynamic GetObjectOrDefault(this IDictionary<string, object> DICT, string key)
        {
            if (DICT.ContainsKey(key))
                return DICT[key];
            else
                return null;
        }

        public static T GetObjectOrDefault<T>(this IDictionary<string, object> DICT, string key)
        {
            if (DICT.ContainsKey(key))
                return (T)Convert.ChangeType(DICT[key], typeof(T));
            else
                return default(T);
        }

        #endregion

        #region "String"

        public static string ToEmpty(this string text)
        {
            if (string.IsNullOrEmpty(text))
                return string.Empty;
            return text;
        }

        public static string ToSelfURL(this string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return text;

            string outputStr = text.Trim().Replace(":", "").Replace("&", "").Replace(" ", "-").Replace("'", "").Replace(",", "").Replace("(", "").Replace(")", "").Replace("--", "").Replace(".", "");
            return Regex.Replace(outputStr.Trim().ToLower().Replace("--", ""), "[^a-zA-Z0-9_-]+", "", RegexOptions.Compiled);
        }

        public static string TrimLength(this string input, int length, bool Incomplete = true)
        {
            if (String.IsNullOrEmpty(input)) { return String.Empty; }
            return input.Length > length ? String.Concat(input.Substring(0, length), Incomplete ? "..." : "") : input;
        }

        public static string TrimFileNameLength(this string input, int length, bool Incomplete = true)
        {
            if (String.IsNullOrEmpty(input)) { return String.Empty; }
            return input.Length > length ? String.Concat(input.Substring(0, length - 3), Incomplete ? "..." : "", input.Substring(input.Length - 3)) : input;
        }



        public static string ToTitle(this string input)
        {
            return String.IsNullOrEmpty(input) ? String.Empty : CultureInfo.CurrentCulture.TextInfo.ToTitleCase(input.ToLower());
        }

        public static bool ContainsAny(this string input, params string[] values)
        {
            return String.IsNullOrEmpty(input) ? false : values.Any(S => input.Contains(S));
        }


        #endregion

        #region DateTime Formats..
        public static string ToFormatDateString(this DateTime? date, string format = "MM/dd/yyyy")
        {
            try
            {
                if (!date.HasValue)
                    return string.Empty;
                return date.Value.ToString(format);
            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }
        public static string GetDayNumberSuffix(this DateTime date)
        {
            if (date == null)
                throw new ArgumentNullException(nameof(date));

            int day = date.Day;

            switch (day)
            {
                case 1:
                case 21:
                case 31:
                    return "st";

                case 2:
                case 22:
                    return "nd";

                case 3:
                case 23:
                    return "rd";

                default:
                    return "th";
            }
        }
        public static string ToDateWithMonthString(this DateTime date)
        {
            try
            {

                return date.ToString("dd MMM yyyy");
            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }

        public static string ToDateWithTimeString(this DateTime? date)
        {
            try
            {
                if (!date.HasValue)
                    return string.Empty;
                return date.Value.ToString("dd MMM yyyy hh:mm tt");
            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }
        public static string GetDescription<TEnum>(this TEnum value)
        {
            var fi = value.GetType().GetField(value.ToString());

            if (fi != null)
            {
                var attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attributes.Length > 0)
                {
                    return attributes[0].Description;
                }
            }

            return value.ToString();
        }
        public static string ToFormatDateString(this DateTime date, string format = "dd/MM/yyyy")
        {
            try
            {
                return date.ToString(format);
            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }

        public static int GetMonthDifference(DateTime startDate, DateTime endDate)
        {
            int monthsApart = 12 * (startDate.Year - endDate.Year) + startDate.Month - endDate.Month;
            return Math.Abs(monthsApart);
        }

        public static DateTime ToFormatDateStringNew(string date, string format = "dd/MM/yyyy")
        {
            try
            {
                return DateTime.ParseExact(date, format, CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {

            }
            return new DateTime();

        }

        public static DateTime? ToDateTime(this string str, bool isWithTime = false)
        {
            if (string.IsNullOrWhiteSpace(str))
                return null;

            string[] formats = { "dd-MM-yyyy","dd/MM/yyyy", "d/MM/yyyy", "dd/M/yyyy", "dd-MM-yyyy h:mm:ss tt", "dd-MM-yyyy HH:mm",
            "dd/MM/yyyy h:mm:ss tt","dd/MM/yyyy h:mm:ss", "d/MM/yyyy h:mm:ss tt","d/MM/yyyy h:mm:ss", "dd/M/yyyy h:mm:ss tt", "yyyy-MM-dd", "yyyy-M-dd",
            "yyyy-MM-d", "yyyy-MM-dd h:mm:ss tt", "yyyy-M-dd h:mm:ss tt", "yyyy-MM-d h:mm:ss tt",
            "d-MM-yyyy", "dd-M-yyyy", "dd-MM-yyyy h:mm:ss", "d-MM-yyyy h:mm:ss tt", "dd-M-yyyy h:mm:ss tt",
            "yyyy/MM/dd", "yyyy/M/dd", "yyyy/MM/d", "yyyy/MM/dd  h:mm:ss tt", "yyyy/M/dd  h:mm:ss tt",
            "yyyy/MM/d  h:mm:ss tt", "d/M/yyyy h:mm:ss tt", "M/dd/yyyy h:mm:ss tt", "MM/dd/yyyy h:mm:ss tt",
            "MM/d/yyyy h:mm:ss tt", "M/dd/yyyy", "MM/dd/yyyy", "MM/d/yyyy", "yyyyMMdd", "d/M/yy" };
            if (isWithTime)
            {
                return DateTime.ParseExact(str, formats, CultureInfo.InvariantCulture, DateTimeStyles.None);
            }

            return DateTime.ParseExact(str, formats, CultureInfo.InvariantCulture, DateTimeStyles.None);
        }

        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }
        #endregion

        public static long? ToLong(this string input)
        {
            long value = 0;
            try
            {
                long.TryParse(input, out value);
            }
            catch (Exception e)
            {
                return null;
            }
            return value;
        }

        public static int? ToInt(this string input)
        {
            int value = 0;
            try
            {
                int.TryParse(input, out value);
            }
            catch (Exception e)
            {
                return null;
            }
            return value;
        }
        public static byte? ToByte(this string input)
        {
            byte value = 0;
            try
            {
                byte.TryParse(input, out value);
            }
            catch (Exception e)
            {
                return null;
            }
            return value;
        }



        public static bool HasValue(this string value)
        {
            return !string.IsNullOrWhiteSpace(value);
        }

        #region "Collection"

        public static void ForEach<T>(this IEnumerable<T> source, Action<T> action)
        {
            if (source != null && source.Count() >= 0)
            {
                foreach (T element in source)
                {
                    action(element);
                }
            }
        }

        public static bool IsNotNullAndNotEmpty<T>(this ICollection<T> source)
        {
            return source != null && source.Count() > 0;
        }



        #endregion

        #region Enum Dropdown




        public static string GetDisplayName<TEnum>(this TEnum enumValue)
        where TEnum : struct
        {
            try
            {
                return enumValue.GetType().GetMember(enumValue.ToString()).First().GetCustomAttribute<DisplayAttribute>() != null ? enumValue.GetType().GetMember(enumValue.ToString()).First().GetCustomAttribute<DisplayAttribute>().GetName() : enumValue.ToString();
            }
            catch (Exception e)
            {
                return enumValue.ToString();
            }
        }
        #endregion

    }
}
