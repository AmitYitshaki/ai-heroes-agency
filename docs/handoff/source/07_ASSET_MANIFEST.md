# Asset Manifest לעיצוב

**גרסה:** 1.5  
**סטטוס:** Review — asset requirements for all 23 battles integrated

## כללים

- כל נכס חייב להיות מקורי או בעל רישיון מתאים.
- יש להציע פורמט יעד: SVG לאייקונים ואלמנטים וקטוריים; WebP/PNG שקוף לדמויות ורקעים; Lottie רק כאשר יש חלופת Reduced Motion.
- לכל אנימציה יש poster frame או state סטטי.
- שמות הקבצים באנגלית, lowercase ו־snake_case.
- אין טקסט עברי צרוב בתוך תמונה; הטקסט נשאר רכיב UI נגיש.

## נכסים גלובליים

| קבוצה | נכסים נדרשים |
|---|---|
| Brand | סימן הסוכנות, wordmark עברי, סמל לופּ-X, favicon/app icon |
| Player | גיבור וגיבורה: idle, selected, map, victory, certificate |
| Loop-X | idle, scan, build, launch, confused, partial, safety, victory |
| Commander Aleph | neutral, briefing, hint, celebration |
| Villains | 5 דמויות, לכל אחת idle, action, reaction, defeat/exit |
| Regions | 4 רקעי אזור, מפה כוללת, מעבר אזור, מגדל/מפעל/מבוך/רובע |
| UI | חבילת אייקונים, prompt cards, stars, map nodes, badges, modal frames |
| Workshop | 12 פריטי קוסמטיקה: 3 בכל חריץ חזותי |
| Bonus | גלגל משימות, 3–4 סמלי קטגוריה, פרס 2 כוכבים |
| Ending | רקע טקס, תג הסמכה, כרטיס שיתוף גנרי |

## קרב 1

- סימולטור גיוס: מצב תקין ומצב עם הריסות.
- לופּ idle, סריקה, קיפאון עקב חוסר מטרה, פינוי הריסות וניצחון.
- מפקדת אלף: תדריך, הסבר מושג, משוב וניצחון.
- כרטיסי הפעולה: ״פנו את ההריסות לצדדים״, ״בדקו״, ״שמרו״, ״סרקו״.
- אייקון תקלה סטטי בלבד; אין הבהוב.

## אזור 1 — קרבות 2–7

הטבלה נועלת את מזהי הנכסים שנוצרו במפרטי הקרבות. הוראות השימוש המדויקות והחלופות נמצאות בקובץ הקרב המתאים.

| קרב | רקע | דמויות ותוצאות | רכיבי UI | שמע |
|---|---|---|---|---|
| 2 | `bg_b02_art_workshop` | `char_loop_b02_wall_kit`, `char_loop_b02_office_kit`, `char_loop_b02_art_kit` | `ui_b02_order_card` | `sfx_b02_scan`, `sfx_b02_success` |
| 3 | `bg_b03_fog_street_map` | `char_loop_b03_colored_lights`, `char_loop_b03_indoor_lights`, `char_loop_b03_stage_spot`, `char_loop_b03_map_lights` | cards use global component system | `sfx_b03_switch`, `sfx_b03_success` |
| 4 | `bg_b04_recruit_meeting` | `char_loop_b04_colorful_hats`, `char_loop_b04_music`, `char_loop_b04_surprise_table`, `char_loop_b04_intro_game` | phrase-repair blocks use global component system | `sfx_b04_music`, `sfx_b04_success` |
| 5 | `bg_b05_agency_canteen` | `char_loop_b05_presenting` | `ui_b05_menu_paragraph`, `ui_b05_menu_summary`, `ui_b05_menu_bullets` | `sfx_b05_print`, `sfx_b05_success` |
| 6 | `bg_b06_information_desk` | `char_loop_b06_two_panels` | `ui_b06_schedule_paragraph`, `ui_b06_schedule_table`, `ui_b06_search_marker` | `sfx_b06_compare`, `sfx_b06_success` |
| 7 | `bg_b07_fog_plaza_mixed` | `char_loop_b07_posters`, `char_loop_b07_maintenance_layout`, `char_loop_b07_event_success` | `ui_b07_paragraph_board`, `ui_slot_locked_correct` | `sfx_b07_dispatch`, `sfx_b07_region_success` |

### כללי נכסים לאזור 1

- כל תוצאת עולם מקבלת frame סטטי מלא עבור Reduced Motion.
- אין flashing, strobe, הבהוב או מידע שתלוי בתנועה.
- טקסטי תפריט, לוח זמנים, הזמנה ופרומפט נשארים HTML נגיש ואינם צרובים בתמונה.
- `ui_slot_locked_correct` כולל אייקון, מסגרת וטקסט `נכון — נשמר`; צבע לבדו אינו מספיק.
- ציוד, תאורה ואפקטים נשארים לא־אלימים ולא מאיימים.
- מקור ורישיון סופיים לכל קובץ ייסגרו לאחר מסירת Claude Design ולפני Release Gate.

## אזור 2 — קרבות 8–13

| קרב | רקע | דמויות ותוצאות | רכיבי UI | שמע |
|---|---|---|---|---|
| 8 | `bg_b08_factory_conveyor` | `char_loop_b08_queue`, `char_loop_b08_area_full`, `char_loop_b08_exact_five` | `ui_b08_prompt_gap` | `sfx_b08_conveyor`, `sfx_b08_success` |
| 9 | `bg_b09_factory_cleaning_zone` | `char_loop_b09_sign_operator` | `ui_b09_prompt_scan`, `ui_b09_joking_sign`, `ui_b09_dramatic_sign`, `ui_b09_calm_sign` | `sfx_b09_print`, `sfx_b09_success` |
| 10 | `bg_b10_factory_design_lab` | `char_loop_b10_abstract_shape`, `char_loop_b10_arrow_emblem`, `char_loop_b10_agency_emblem` | `ui_b10_reference_wayfinding`, `ui_b10_reference_emblem` | `sfx_b10_reference_attach`, `sfx_b10_success` |
| 11 | `bg_b11_meeting_room` | `char_loop_b11_duck_clutter`, `char_loop_b11_surprise_decor`, `char_loop_b11_vague_decor`, `char_loop_b11_meeting_ready` | `ui_b11_counterexample_card` | `sfx_b11_arrange`, `sfx_b11_success` |
| 12 | `bg_b12_quality_lab` | `char_loop_b12_vague_approval`, `char_loop_b12_runtime_test` | `ui_b12_manual_rule`, `ui_b12_battery_alpha`, `ui_b12_battery_beta` | `sfx_b12_test`, `sfx_b12_success` |
| 13 | `bg_b13_factory_control_gate` | `char_loop_b13_weight_samples`, `char_loop_b13_structure_mismatch`, `char_loop_b13_factory_success` | `ui_b13_reference_package_a`, `ui_b13_water_test_station`, `ui_slot_locked_correct` | `sfx_b13_dispatch`, `sfx_b13_region_success` |

### כללי נכסים לאזור 2

- תוויות מספריות, טקסטי שלטים, זמני סוללה, כללי מדריך ותוצאות בדיקה נשארים HTML נגיש ואינם חלק מהתמונה.
- דוגמאות חזותיות מובנות מקבלות שם ותיאור חלופי; אין העלאת קובץ מהילד.
- תוצאות מעבר/כשל מוצגות כמצבים בטוחים וסטטיים: אין נפילה, חסימת יציאה, ציוד שנרטב או חפצים שעפים.
- בדיקת המים בקרב 13 מתבצעת על אריזת הדגמה ריקה בתוך עמדה סגורה.
- אין flashing, strobe או מצב נעול/עבר/לא עבר שמזוהה באמצעות צבע בלבד.

## אזור 3 — קרבות 14–18

| קרב | רקע | דמויות ותוצאות | רכיבי UI | שמע |
|---|---|---|---|---|
| 14 | `bg_b14_packing_station` | `char_loop_b14_closed_early`, `char_loop_b14_move_early`, `char_loop_b14_package_success` | `ui_b14_order_slots` | `sfx_b14_sequence`, `sfx_b14_success` |
| 15 | `bg_b15_data_archive` | `char_loop_b15_wrong_excerpt`, `char_loop_b15_open_delimiter`, `char_loop_b15_good_summary` | `ui_b15_mixed_text_block`, `ui_b15_delimited_diary` | `sfx_b15_scan`, `sfx_b15_print`, `sfx_b15_success` |
| 16 | `bg_b16_print_station` | `char_loop_b16_note_result` | `ui_b16_conflict_prompt`, `ui_b16_clipped_note`, `ui_b16_size_options`, `ui_b16_clear_note` | `sfx_b16_print`, `sfx_b16_success` |
| 17 | `bg_b17_sorting_station` | `char_loop_b17_compare`, `char_loop_b17_sort_success` | `ui_b17_version_compare`, `ui_b17_two_small_trays`, `ui_b17_three_large_trays` | `sfx_b17_test`, `sfx_b17_success` |
| 18 | `bg_b18_archive_station` | `char_loop_b18_file_test`, `char_tangle_b18_region_exit` | `ui_b18_order_cards`, `ui_b18_seal_rules`, `ui_b18_waiting_tray`, `ui_b18_approval_tray`, `ui_b18_saved_component` | `sfx_b18_file_check`, `sfx_b18_region_success` |

### כללי נכסים לקרבות 14–18

- סדר הפעולות בקרב 14 מוצג גם במספרים ובטקסט; תנועה אינה המקור היחיד להבנת הסדר.
- הוראה, חומר גלם, מפרידים וסיכום בקרב 15 נשארים HTML נגיש עם בידוד RTL/LTR מתאים.
- טקסט חתוך בקרב 16 הוא הדגמת פריסה בלבד; הטקסט המלא נשאר זמין לטכנולוגיה מסייעת.
- השוואת הגרסאות בקרב 17 מציגה כל רכיב בשם; ההבדלים אינם תלויים בצבע.
- תוצאות המיון בקרב 17 הן מצבים סטטיים סגורים ואינן כוללות חפצים שעפים.
- סידור הכרטיסים בקרב 18 כולל פקדי העלאה/הורדה ומספרי מיקום בנוסף לגרירה.
- מצב `נכון — נשמר` בקרב 18 כולל אייקון, מסגרת וטקסט; אין נעילה המבוססת על ירוק בלבד.
- תוצאת סיום אזור 3 מנתבת לסדנה 3 ולבונוס האופציונלי לפני פתיחת קרב 19.

## אזור 4 — קרבות 19–22

| קרב | רקע | דמויות ותוצאות | רכיבי UI | שמע |
|---|---|---|---|---|
| 19 | `bg_b19_uniform_lab` | `char_loop_b19_compare` | `ui_b19_same_prompt`, `ui_b19_uniform_silver`, `ui_b19_uniform_badge`, `ui_b19_criterion_panel` | `sfx_b19_compare`, `sfx_b19_success` |
| 20 | `bg_b20_schedule_room` | `char_loop_b20_compare` | `ui_b20_ai_schedule`, `ui_b20_agency_guide`, `ui_b20_draft_preview` | `sfx_b20_compare`, `sfx_b20_success` |
| 21 | `bg_b21_privacy_room` | `char_loop_b21_privacy_shield` | `ui_b21_draft_fields`, `ui_b21_redaction_pattern`, `ui_b21_safe_preview` | `sfx_b21_redact`, `sfx_b21_success` |
| 22 | `bg_b22_command_deck` | `char_loop_b22_shield`, `char_aleph_b22_report` | `ui_b22_candidate_report`, `ui_b22_approved_guide`, `ui_b22_responsibility_checklist` | `sfx_b22_review`, `sfx_b22_region_success` |

### כללי נכסים לאזור 4

- שתי תוצאות קרב 19 הן הדמיה סטטית מאושרת; העיצוב אינו מרמז שנוצר AI בזמן אמת.
- מקור מועמד ומקור מאושר בקרבות 20 ו־22 מקבלים כותרת טקסט קבועה ונפרדת.
- סימון פרטיות, אימות והצלחה משתמש באייקון ובטקסט; צבע לבדו אינו נושא מידע.
- שדות מידע אישי בקרבות 21–22 הם תוויות דמה בלבד ואינם צרובים בנכס חזותי.
- תוצאות חלקיות נשארות בתצוגה מקומית. אין המחשה של פרסום, שידור או דליפת מידע.
- אין flashing, strobe, אזעקה, איום, טיסה שהוחמצה או חסימת דמות כעונש.
- אין רדיפה, זריקה, מעיכת נייר, עשן, אש, רעד או הבהוב.
- חריצים, גבולות וסתירות מזוהים באמצעות אייקון, מסגרת ותווית ולא באמצעות צבע בלבד.

## קרב 23

- רקע סוכנות משובש ורקע משוחזר.
- המשבש: idle, הצעה לא מאומתת, תגובת הפסד.
- לוח המדריך המאושר וחמשת הצעדים.
- פתקית מידע אישי בדיונית ובועת ״בלונים״ לא מאומתת.
- לופּ לכל שבע משפחות התוצאה:
  - `unsafe_personal_data`: מגן/מנעול ניטרלי וסטטי.
  - `unclear_goal_or_context`: פעולה לא ממוקדת.
  - `missing_constraint`: תכנית ארוכה מדי.
  - `missing_format`: גוש טקסט צפוף.
  - `missing_success_criteria`: שלב חסר.
  - `unverified_information`: בלונים קומיים.
  - `full_success`: לוח מסודר ומואר.
- גרסת Reduced Motion סטטית לכל תוצאה.

## שמע נדרש

- מוזיקת מפה/מטה ומוזיקת קרב בלולאות קצרות.
- סריקה, שיגור, תיקון, הצלחה, כוכבים, סדנה, בטיחות ומעבר אזור.
- כל צליל קצר, לא צורם, ועם מקבילה חזותית.

## Handoff

לכל נכס יש למסור: `assetId`, תיאור, מסך/מצב שימוש, dimensions, format, transparency, animation duration, reduced-motion fallback, license/source ו־priority (`MUST` / `SHOULD`).
