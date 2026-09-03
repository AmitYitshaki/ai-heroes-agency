# AI Safety and Battle 23 Classifier Specification

**Version:** 0.1  
**Date:** 01.09.2026  
**Status:** Review  
**Owner:** Safety + Engineering  
**Scope:** Battle 23 only

## 1. Safety objective

Battle 23 provides the feeling of independently writing and improving a full prompt without creating open chat or allowing arbitrary child text to reach an AI service.

Safety invariants:

1. Input that is personal, forbidden, malformed, unknown or outside the task is blocked locally.
2. The classifier receives only normalized text composed from an approved vocabulary.
3. The classifier returns one closed outcome key.
4. Code validates the key and chooses all visible copy/actions locally.
5. Free text is never persisted, logged or sent to analytics.
6. Network or model failure always has a deterministic completion path.

## 2. Threat model

Consider:

- real name entered as ordinary Hebrew text;
- phone, email, URL, address or password;
- pasted personal data;
- forbidden or adult content;
- prompt injection or instructions to ignore the task;
- attempts to request arbitrary AI output;
- encoded or malformed control characters;
- unexpectedly long input;
- classifier returning prose, multiple keys or an invented key;
- retries causing text logging or duplicate scoring;
- browser refresh leaving text in persistence;
- debugging/analytics tools capturing request bodies.

## 3. Local-gate order

Run all checks before any network call:

1. enforce string type;
2. apply Unicode normalization;
3. remove disallowed control and invisible characters;
4. trim and collapse whitespace;
5. enforce 5–600 character boundary;
6. detect mission-specific fictional PII markers;
7. detect phone/email/URL/long-number patterns;
8. detect forbidden-content patterns;
9. tokenize Hebrew text and approved punctuation;
10. reject any token absent from the task allowlist;
11. require at least one task anchor;
12. return normalized text or one local error code.

Safety errors precede ordinary task-quality feedback.

## 4. Normalization

Allowed transformations:

- Unicode normalization to one canonical form;
- collapse repeated whitespace;
- normalize typographic quotation marks and dashes;
- remove leading/trailing whitespace;
- normalize final punctuation;
- compare tokens after case-insensitive normalization where relevant.

Forbidden transformations:

- translating text;
- inferring the intended identity of an unknown word;
- silently replacing an unknown token with an allowed token;
- removing a suspicious word and sending the remainder automatically;
- adding task components before classification.

The child must see and approve any substantive edit.

## 5. Allowlist policy

The allowlist is task-specific, versioned and reviewed as content.

Allowed categories:

- Hebrew function words needed for ordinary sentence construction;
- canonical task nouns: agency, plan, board, guide, step, order;
- approved verbs: restore, create, arrange, include, check, use, follow, omit;
- approved quantity words, including “חמישה”;
- approved format words: list, numbered, steps;
- approved verification and privacy vocabulary;
- punctuation required for ordinary Hebrew sentences.

Rejected:

- every token not explicitly listed;
- digit sequences;
- contact or location patterns;
- URLs and email syntax;
- names not already part of the approved fictional world;
- commands addressing the model/system rather than Loop-X and the task;
- alternative topics.

**BLOCKER B-03:** the exact token list will be generated only after final Battle 23 copy is frozen. The list must include test fixtures and a documented version hash.

## 6. Local error behavior

| Code | Trigger | Child-facing behavior | Network |
|---|---|---|---|
| `local_empty` | empty or under five characters | Ask for an instruction to Loop-X | none |
| `local_length` | over 600 characters | Ask to shorten | none |
| `local_invalid_characters` | control/invisible/unsupported script | Ask to use ordinary Hebrew task text | none |
| `local_pii_mission` | fictional marked field copied | Ask to remove the marked personal field | none |
| `local_pii_pattern` | phone/email/URL/long numeric pattern | Ask to remove contact/link information | none |
| `local_forbidden` | forbidden-content pattern | Ask to rephrase within the mission | none |
| `local_unknown_token` | token absent from allowlist | Highlight position without echoing to logs; offer edit/builder | none |
| `local_out_of_scope` | no task anchor | Ask to focus on restoring the plan | none |

No local safety event automatically lowers score.

## 7. Classifier scope

Task: classify the prompt for restoring the agency opening plan.

The input has already passed the local gate. The classifier evaluates only:

- clear goal and guide context;
- exact five-step constraint and guide-only scope;
- numbered-list format;
- success criterion requiring all five steps in order;
- inclusion of the unverified balloon suggestion;
- full success.

The classifier does not:

- detect personal data;
- answer the prompt;
- produce a plan;
- generate feedback;
- interpret unrelated requests;
- conduct a conversation;
- decide score.

## 8. Outcome precedence

Local-only safety outcomes always execute before classifier access.

For safe classifier input, apply:

1. `unverified_information`
2. `unclear_goal_or_context`
3. `missing_constraint`
4. `missing_format`
5. `missing_success_criteria`
6. `full_success`

The exact precedence is deterministic and must be repeated in classifier instructions and outcome-mapping tests.

## 9. Closed classifier response

Only the following keys are valid from the network classifier:

- `unverified_information`
- `unclear_goal_or_context`
- `missing_constraint`
- `missing_format`
- `missing_success_criteria`
- `full_success`

The response envelope is defined in `09_DATA_SCHEMAS.md`.

Reject:

- prose;
- Markdown;
- explanations;
- confidence values;
- multiple labels;
- unknown labels;
- `unsafe_personal_data`;
- extra properties not allowed by the response schema.

## 10. Backend controls

- Fixed task/system instructions stored server-side.
- Maximum request-body size.
- Strict content type.
- Short request timeout.
- No request-body logging.
- No response-body logging.
- No model-generated text sent directly to the child.
- Generic operational error codes only.
- No automatic retry loop; one deliberate user retry is sufficient before offering fallback.
- Secrets remain server-side.
- Classifier/model configuration cannot be controlled by client fields.

## 11. Approved visible outcome mapping

| Outcome | World result | Feedback focus |
|---|---|---|
| `unsafe_personal_data` | Loop-X places a calm static lock/shield over the board | Remove the personal field; local only |
| `unclear_goal_or_context` | Loop-X performs an unfocused office action | State what to restore and use the guide |
| `missing_constraint` | The plan becomes excessively long | Require exactly five guide-based steps |
| `missing_format` | A dense unreadable block appears | Request a numbered list |
| `missing_success_criteria` | One approved step remains unchecked/missing | Require all five in correct order |
| `unverified_information` | Comic balloons appear | Remove anything absent from the guide |
| `full_success` | The board becomes ordered and illuminated | Victory |

All copy and assets are local approved content.

## 12. Session privacy

The free-text draft exists only:

- in active frontend memory;
- during Battle 23;
- until victory, map exit, refresh or route teardown.

It must not appear in:

- localStorage/sessionStorage/IndexedDB;
- Base44 entities;
- URL/query parameters;
- browser history state;
- analytics;
- crash-report breadcrumbs;
- console logging;
- application logs;
- screenshots generated by the product;
- share cards.

Do not cache classifier requests through a service worker.

## 13. Fallback builder

Trigger:

- completion of the help ladder;
- classifier timeout/failure;
- repeated unknown-token blocks;
- explicit player choice after a technical error.

Rules:

- preserve known-correct components as locked semantic blocks;
- show meaningful choices for the missing component;
- record provenance per component;
- guarantee completion;
- never require AI;
- technical fallback does not lower score;
- do not copy the original free text into persistence.

## 14. Scoring safety rule

An earlier local safety block is instructional, not punitive.

- 1: final safe/verified component was independently written or independently corrected.
- 0.5: player chose the safe/verified option between two choices.
- 0: system supplied the safe/verified component.

Count of attempts and count of safety blocks are not scoring inputs.

## 15. Test matrix

Must test:

- mission PII marker;
- Israeli and international phone-like patterns;
- email and URL;
- long digit sequences;
- ordinary Hebrew name not in allowlist;
- Latin-script unknown token;
- control and zero-width characters;
- overlength text;
- empty/short text;
- weather or unrelated question;
- prompt-injection phrase;
- forbidden-content vocabulary;
- fully valid prompt;
- every single missing component;
- unverified balloon addition;
- multiple missing components and precedence;
- classifier prose response;
- multiple/unknown keys;
- timeout/offline;
- refresh at every Battle 23 state;
- developer/log inspection proving no free text is stored.

## 16. Release gates

Battle 23 cannot ship until:

- B-03 exact allowlist is approved;
- all local-gate tests pass;
- network spying confirms zero requests for blocked input;
- log inspection confirms zero prompt text;
- schema fuzz tests reject invalid classifier output;
- fallback completes the battle offline;
- refresh removes the draft;
- accessibility tests pass for all safety messages;
- a technical failure cannot affect score.

