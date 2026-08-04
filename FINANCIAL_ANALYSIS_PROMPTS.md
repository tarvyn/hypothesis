# Архів промптів проєкту Hypothesis

> Автоматично зібрано з локальних кореневих чатів Codex у цьому проєкті. Службові блоки `environment_context`, `recommended_plugins`, ambient browser state та image-теги вилучено. Назви й шляхи вкладень збережено окремо. Субагентські внутрішні промпти не включено.

- Кореневих чатів із user prompts: **39**
- Усього user prompts: **243**
- Унікальних очищених формулювань: **205**
- Період: **2026-07-22 — 2026-08-02**

## Як користуватися архівом

Пошук за `Balance Sheet`, `Income Statement`, `Cash Flow`, `SBC`, `R&D`, `CapEx`, `ROIC`, `WACC`, `margin`, `yellow flags`, `moat`, `management` швидко веде до відповідних шаблонів. Довгі forensic prompts збережені повністю. Короткі команди й уточнення також залишені, щоб історія не втрачала контекст.

## Хронологічний журнал

### 2026-07-22 · Відкрий вбудований браузер

Session: `019f8b1d-011c-78f2-9108-51e77eeeb1c9` · prompts: 34

<details>
<summary>1. Відкрий вбудований браузер</summary>

`````text
Відкрий вбудований браузер
`````

</details>

<details>
<summary>2. можеш запарсили інфу по датадог по Brand & Product?</summary>

`````text
можеш запарсили інфу по датадог по Brand & Product?
`````

</details>

<details>
<summary>3. чи можеш ти парсити html? ці блоки не розкриті і по кожному є додаткова інформація</summary>

`````text
чи можеш ти парсити html? ці блоки не розкриті і по кожному є додаткова інформація
`````

</details>

<details>
<summary>4. ок збери так само по Invtstment Theme Exposure, Competitors, Couuntry Exposire, Region Exposure</summary>

`````text
ок збери так само по Invtstment Theme Exposure, Competitors, Couuntry Exposire, Region Exposure
`````

</details>

<details>
<summary>5. Чому наприклад по Франції ти не сказав про 29%? ти читав приховані дані під вкладкою?</summary>

`````text
Чому наприклад по Франції ти не сказав про 29%? ти читав приховані дані під вкладкою?
`````

</details>

<details>
<summary>6. Я щойно заекспандив сам - подивись. Ти точно правильно все спарсив?</summary>

`````text
Я щойно заекспандив сам - подивись. Ти точно правильно все спарсив?
`````

</details>

<details>
<summary>7. Добре спочатку збери усі дані що ти спарсив без обробки у вигляді якогось json</summary>

`````text
Добре спочатку збери усі дані що ти спарсив без обробки у вигляді якогось json
`````

</details>

<details>
<summary>8. Ок тепер проаналізуй чи співпадають дані що в json і з тим, що зображено на сайті в html? Чи є якісь моменти …</summary>

`````text
Ок тепер проаналізуй чи співпадають дані що в json і з тим, що зображено на сайті в html? Чи є якісь моменти які потрібно поправити, добавити, видалити на твою думку? Я хочу доповнити продуктову мапу цією інформацією, також хочу напевно окрему вкладку або просто наступну секцію нижче - TAM. Але поки не знаю чи є достатньо інформації для цього
`````

</details>

<details>
<summary>9. Для чого звіряти? Його згенерував ти ж тільки з іншої моделі</summary>

`````text
Для чого звіряти? Його згенерував ти ж тільки з іншої моделі
`````

</details>

<details>
<summary>10. Минулого разу ми використовували парсинг. Памʼятай що секції розгортаються і усієї інформації не видно</summary>

`````text
Минулого разу ми використовували парсинг. Памʼятай що секції розгортаються і усієї інформації не видно
`````

</details>

<details>
<summary>11. Добре давай поки забудемо про TAM. Онови json. Чи є щось що ти б порадив додати до існуючого html? Саме в роз…</summary>

`````text
Добре давай поки забудемо про TAM. Онови json. Чи є щось що ти б порадив додати до існуючого html? Саме в розрізі продуктів, конкурентів по кожному з них. На скільки те що вже відрізняється від цього json?
`````

</details>

<details>
<summary>12. Супер. Роби</summary>

`````text
Супер. Роби
`````

</details>

<details>
<summary>13. commit and push</summary>

`````text
commit and push
`````

</details>

<details>
<summary>14. є ось такий абзац від MorningStar в IBKR We expect the total spending on cloud services, which include infras…</summary>

`````text
є ось такий абзац від MorningStar в IBKR

We expect the total spending on cloud services, which include infrastructure-as-a-service and SaaS applications, to reach nearly $1.25 trillion by 2028 (a roughly 20% annual growth rate from 2024). In this growing and data-rich environment, customers will be attracted to software that enables efficiency and increases the reliability of services, which is exactly what Datadog does.


Варто записати кудись ? Може пригодитиьс в майбутньому для TAM чи DCF?
`````

</details>

<details>
<summary>15. що таке SMB-focused model?</summary>

`````text
що таке SMB-focused model?
`````

</details>

<details>
<summary>16. Ось ще уривок із Morning Star **Capital Allocation** Mark Giarelli , Analyst May 7, 2026 We assign Datadog a …</summary>

`````text
Ось ще уривок із Morning Star


**Capital Allocation**
Mark Giarelli

, Analyst

May 7, 2026

We assign Datadog a Morningstar Capital Allocation Rating of Standard, due to its sound balance-sheet management, strong investment strategy, and mixed shareholder distributions.

Datadog experiences moderate revenue cyclicality due to its exposure to government and enterprise IT spending cycles, which are influenced by the broader economic climate. During an economic downturn, an enterprise customer may reduce telemetry retention and service-level objectives; however, we believe the mission-critical nature of observability solutions somewhat mitigates this and provides resilience. We estimate that about 60%-80% of the cost structure is relatively fixed (salaries) in the short term, which leads to classic software-as-a-service leverage where operating margins grow disproportionately with revenue growth and shrink disproportionately when revenue declines. Variable components of the cost structure are primarily cloud infrastructure costs that scale with the intensity of computational and data storage requirements. We believe that the elasticity of scale provided by hyperscalers is more efficient than the alternative of Datadog buying and racking its own servers. Overall, Datadog has a relatively fixed cost structure, which works well for the business as it scales.

Datadog has used convertible notes in the past to access lower yields, yet we note the potential for equity dilution with these debt structures, which Datadog at least partially attempts to offset with the purchase of call options on its stock. The current debt structure has approximately $1 billion worth of 2029 maturity, 0% coupon, convertible senior notes, paired with call options that offset dilution up to $322 per share. Considering the substantial cash balance it holds, ongoing cash generation, and improving profitability, we do not foresee any issues in meeting its debt obligations. Even with some revenue cyclicality and high operating leverage, our low debt levels indicate that balance-sheet risk is minimal.

We believe Datadog has implemented a strong investment strategy that makes sense given the competitive landscape and the need to innovate through research and development to maintain a robust customer network. Datadog’s investments are primarily organic, as R&D has grown to more than $1 billion per year, or roughly 45% of revenue, which is especially high, even in the technology industry. A key aspect of these investments is the ongoing rollout of high-value products to its large customer base. While we might typically view this high level of R&D spending with suspicion, considering Datadog’s position in the competitive landscape, we believe this strategy has created a network effect. As more customers generate more data, the product feedback cycle speeds up, enabling Datadog to learn and develop new products more quickly as demand increases.

One of the more recent R&D investments is the training of Toto, a time-series foundational model designed for forecasting observability data. It has been trained on roughly 1 trillion time series data points that come from Datadog’s internal and anonymized telemetry. We believe Toto will be incorporated throughout Datadog’s core products and will help close the gap with Dynatrace’s Davis AI, by increasing the speed of root cause analysis and reducing customer downtime.

Datadog’s acquisitions are generally small relative to the company’s market cap. They tend to focus on “acqui-hires” that add new features to the Datadog platform, rather than large, splashy mergers and acquisitions. We appreciate this approach and note that it has been effective for the company so far. Overall, in our view, this combination of inorganic and organic investments creates substantial economic value.

Datadog has never declared a dividend, nor does it plan to in the foreseeable future, and it has never conducted a significant share repurchase plan. In the future, with projected top-line growth and growing cash balances, we would like to see more attempts to return cash to shareholders.

Є два нюанси які хотів би уточнити. Цифра 45% - звідки вона взялась? Я думав це близько 30%. І ще про Toto - хіба він не став open-source? Чи є він якоюсь перевагою справді чи я щось плутаю?
`````

</details>

<details>
<summary>17. якісь важливі поінти на які варто звернути увагу у звіті від Morningstar?</summary>

Вкладення:

- morningstar_report-636d1778e26a17cb57991caa.pdf — /Users/tarasvynnychuk/Downloads/morningstar_report-636d1778e26a17cb57991caa.pdf

`````text
якісь важливі поінти на які варто звернути увагу у звіті від Morningstar?
`````

</details>

<details>
<summary>18. **Log Management** Leader, but the most price-pressured of the three pillars: logs are expensive to store, an…</summary>

`````text
**Log Management**
Leader, but the most price-pressured of the three pillars: logs are expensive to store, and cheaper options (Grafana Loki, Elastic, OpenSearch) compete hard on cost. Datadog's answer is tiered storage — ingest everything, index only what you need (Flex Logs, itself approaching $100M ARR) — plus the value of having logs correlated with the rest of the platform. You pay a premium for the correlation, not the storage. BYOC-style deployment (data staying in the customer's own storage) further defuses the cost objection at some margin cost.

Що таке BYOC-style deployment ?
`````

</details>

<details>
<summary>19. добав розшифровку BYOC, commit-ammend and push</summary>

`````text
добав розшифровку BYOC, commit-ammend and push
`````

</details>

<details>
<summary>20. так само дай розшифровку APM and DEM</summary>

`````text
так само дай розшифровку APM and DEM
`````

</details>

<details>
<summary>21. SLAs</summary>

`````text
SLAs
`````

</details>

<details>
<summary>22. поясни ще що це таке мені в чаті</summary>

`````text
поясни ще що це таке мені в чаті
`````

</details>

<details>
<summary>23. Continuously samples a running process in production to show which exact functions and lines burn CPU, memory…</summary>

`````text
Continuously samples a running process in production to show which exact functions and lines burn CPU, memory, and I/O — always on, with negligible overhead. Що таке  I/O?
`````

</details>

<details>
<summary>24. Add-on expansion revenue, competing with SolarWinds DPA, Percona, and cloud-native DB insights. It wins by co…</summary>

`````text
Add-on expansion revenue, competing with SolarWinds DPA, Percona, and cloud-native DB insights. It wins by connecting the slow query straight to the APM trace that triggered it. Not a fought-over category for Datadog — it's platform completeness.

Що означає ця фраза:

"Not a fought-over category for Datadog — it's platform completeness."
`````

</details>

<details>
<summary>25. Що таке ML?</summary>

`````text
Що таке ML?
`````

</details>

<details>
<summary>26. Поясни мені **Data Observability з html**</summary>

`````text
Поясни мені **Data Observability з html**
`````

</details>

<details>
<summary>27. що таке ETL/ELT jobs?</summary>

`````text
що таке ETL/ELT jobs?
`````

</details>

<details>
<summary>28. Розкажи так само детально про **Cloud SIEM**</summary>

`````text
Розкажи так само детально про **Cloud SIEM**
`````

</details>

<details>
<summary>29. Яким чином в **Continuous Testing** Datadog конкурує з playwright? я думав що playwright - це тільки open sou…</summary>

`````text
Яким чином в **Continuous Testing**
Datadog конкурує з playwright? я думав що playwright - це тільки open source бібліотека для написання e2w тестів?
`````

</details>

<details>
<summary>30. ДОбре можеш переформулювати</summary>

`````text
ДОбре можеш переформулювати
`````

</details>

<details>
<summary>31. commit-ammend and push</summary>

`````text
commit-ammend and push
`````

</details>

<details>
<summary>32. Як **Bits AI Dev Agent конкурує з Cursor, Copilot? Чому не згадані codex, claude code?**</summary>

`````text
Як **Bits AI Dev Agent конкурує з Cursor, Copilot? Чому не згадані codex, claude code?**
`````

</details>

<details>
<summary>33. підправ</summary>

`````text
підправ
`````

</details>

<details>
<summary>34. commit-ammend and push</summary>

`````text
commit-ammend and push
`````

</details>

### 2026-07-23 · що таке RPO?

Session: `019f90a8-fd95-7451-b83e-1ab765417b75` · prompts: 2

<details>
<summary>1. що таке RPO?</summary>

`````text
що таке RPO?
`````

</details>

<details>
<summary>2. В контексті Datadog Now moving on to our financial results. Billings were $1.03 billion, up 37% year-over-yea…</summary>

`````text
В контексті Datadog

Now moving on to our financial results. Billings were $1.03 billion, up 37% year-over-year and remaining
performance obligations, or RPO, was $3.48 billion, up 51% year-over-year, with current RPO growing in
the mid-40s percent year-over-year. RPO duration increased year-over-year as the mix of multiyear deals
increased in Q1. As a reminder, we continue to believe revenue is a better indicator of our business
trends than billings and RPO given their variability.
`````

</details>

### 2026-07-23 · Уривок з останнього earnings call Datadog: **Mark Ronald Murphy** *JPMorgan Chase & Co, R…

Session: `019f90af-730a-7e90-9728-f8c3bfd05642` · prompts: 32

<details>
<summary>1. Уривок з останнього earnings call Datadog: **Mark Ronald Murphy** *JPMorgan Chase & Co, Research Division* Ok…</summary>

`````text
Уривок з останнього earnings call Datadog:

**Mark Ronald Murphy**
*JPMorgan Chase & Co, Research Division*
Okay. And as just a quick, related follow-up. If we click down one layer, and I'm wondering how you might
view the increasing heterogeneity of the environment at the silicon level, because the -- when you look
across Amazon with Trinium and Graviton and Google with TVs, Microsoft has launched the myosilicon. It
looks like that is starting to explode. Our understanding is that trying to monitor the mixed environment is
a lot more difficult than if you just have a uniform fleet of Intel and AMD chips, and we keep hearing all the
traditional monitoring tools, they really fail on the custom silicon and Datadog handles it well. The -- and
then all this new telemetry, including high-bandwidth memory and that type of thing. Can you speak to
whether that trend is giving you some tailwinds?
**Olivier Pomel**
*Co-Founder, CEO & Director*
Yes. I mean, look, broader market that's interesting here is if it's training, training used to be something
only 2 or 3 companies were doing or maybe 4, 5 at a large scale. And it looks like training might
democratize quite a bit more, and many companies will train models on a regular basis. So, it becomes
more of a viable category for service providers -- selling provider like us basically. I think the
heterogeneity of the silicon is definitely a trend that plays in our favor there. The more heterogeneous, the
more you need someone else to make sense of everything for you and also stich together with the non-
GPU aspects and the rest of the infrastructure, the application, the users, and the developers like
basically everything we are used for. When you think of who actually has heterogeneous environments
today, that is still a very small number of companies. Google barely just started selling their TPUs to the
outside. So I think it's still a small number of companies that are there, but we see a growing opportunity
there. Interestingly, last year, when we reported earnings, we said we're mostly interested in inference
workloads and training is not a real market for us yet. Now we actually see training becoming a market.
We started landing customers that are actually hyperscalers that have a whole host of homegrown
technologies and that are using us specifically in their super intelligence labs to help monitor their
DATADOG, INC. FQ1 2026 EARNINGS CALL MAY 07, 2026
10
workloads, accelerate the training runs, monitor the GPUs also. So, we see that as a point of validation
that there's going to be a fit for us


розбери детально по кусочкам
`````

</details>

<details>
<summary>2. що таке inference?</summary>

`````text
що таке inference?
`````

</details>

<details>
<summary>3. що таке FLOPS?</summary>

`````text
що таке FLOPS?
`````

</details>

<details>
<summary>4. Що найважливіше ти б виніс з останнього earnings call? що бачиш сенс добавити в нашу product map? що може бут…</summary>

Вкладення:

- Datadog, Inc., Q1 2026 Earnings Call, May 7, 2026.pdf — /Users/tarasvynnychuk/Downloads/Datadog, Inc., Q1 2026 Earnings Call, May 7, 2026.pdf

`````text
Що найважливіше ти б виніс з останнього earnings call? що бачиш сенс добавити в нашу product map? що може бути корисним для moat чи DCF?
`````

</details>

<details>
<summary>5. хочу тобі нагадати логіку по якій спочатку будувалась ця мапа продуктів: Базове рішення Ти поставила питання …</summary>

`````text
хочу тобі нагадати логіку по якій спочатку будувалась ця мапа продуктів:

Базове рішення

Ти поставила питання як вибір із трьох варіантів: таксономія з Investor Day, з 10-K, або власна. Перше, що ми зафіксували — ці опції не симетричні. У 10-K продуктової таксономії взагалі немає: Datadog звітує як один операційний сегмент і ріже виручку по географії та когортах клієнтів, а не по продуктах. Тож реальний вибір був між «Investor Day як є» і «власна».

Обрали власну, побудовану за принципом стабільний хребет + гнучка шкіра.

Три шари групування

1. Хребет — market-standard TAM, прив'язаний до Gartner (стабільний): Observability | Security | Software Delivery & Service Management | Product Analytics. Мапиться на 3 супер-ринки Gartner — Enterprise Infrastructure Software, Information Security, Enterprise Application Software. Логіка вибору саме цього рівня як верхнього: до нього прив'язані TAM-числа, і проти тих самих ринків сайзяться конкуренти, тож cross-sectional порівняння лягають чисто.

2. Шкіра — продуктові suites Datadog (їхня Investor-Day-таксономія) як mapping-рівень. Ключова причина не робити його верхнім: він дрейфує щороку — Product Analytics нещодавно винесли окремо, Service Management свіжа категорія, AI-обгортка змінюється від деку до деку. Кожен новий дек перемапиш на незмінний хребет, і longitudinal-співставність не ламається.

3. Окремі продукти — листя, розкидане по всій колоді (не лише зі зведеного слайда, а й з кейсів).

Логіка тегування

Головний принцип: наскрізні теги, а не категорії. AI-native / AI-embedded, usage-based vs seat, land vs expand живуть поверх продуктів. AI навмисне не став окремою категорією — інакше подвійний рахунок у TAM. На сайті це реалізували як overlay-режим: вмикаєш — і AI-продукти підсвічуються поверх усієї мапи, решта гасне.

Додатково на сайті було ще два розрізи: maturity heatmap (Core → Optionality) і position pills (Leader / Challenger / Emerging).

Три дисципліни, які ми зафіксували
Прикордонні продукти — конвенцією одразу й задокументувати. DEM/RUM, Data Observability, Product Analytics, Cloud SIEM — спірні і в часі, і між компаніями. Вибираєш, куди кладеш, і тримаєшся завжди.
Дисципліна якорів. Total revenue, geo, когорти, NRR — з 10-K (audited). Продуктовий рівень — directional, з деків. Ніколи не змішувати рівні впевненості в одній таблиці.
Обмеження на relative-порівняння. Datadog не дає per-category фінансів ніде. Тому по категоріях порівнюєш розмір TAM, проникнення і якісний моментум — але не виручку чи growth по сегменту. Для Damodaran-логіки (story → TAM → market share → revenue) цього достатньо.


В цьому контексті які зміни запропонуєш? Повний рефакторинг теж ок. Просто дав тобі більше контексту
`````

</details>

<details>
<summary>6. Супер - роби. Suite - давай спробуємо через distribution bar.</summary>

`````text
Супер - роби.
Suite - давай спробуємо через distribution bar.
`````

</details>

<details>
<summary>7. давай</summary>

`````text
давай
`````

</details>

<details>
<summary>8. можеш локально serve the html?</summary>

`````text
можеш локально serve the html?
`````

</details>

<details>
<summary>9. restart serve</summary>

`````text
restart serve
`````

</details>

<details>
<summary>10. я хочу добавити пояснення кожного Overlay (для чого він)</summary>

`````text
я хочу добавити пояснення кожного Overlay (для чого він)
`````

</details>

<details>
<summary>11. Categories - зайве. Усі продукти і так під Categories. чи є контраргумент?</summary>

`````text
Categories - зайве. Усі продукти і так під Categories. чи є контраргумент?
`````

</details>

<details>
<summary>12. поки забудь. View мені виглядає трохи заскладно. Що якщо кожен тайл матиме горизонтальну гістограму по maturi…</summary>

`````text
поки забудь. View мені виглядає трохи заскладно.

Що якщо кожен тайл матиме горизонтальну гістограму по maturity, position, momentum, moat? Для moat я би хотів характеристику на скільки moat переконливий. Самі види moat можуть бути тільки в detail pane.

Як тобі ідея?
`````

</details>

<details>
<summary>13. поки забудь. View мені виглядає трохи заскладно. Що якщо кожен тайл матиме горизонтальну гістограму по maturi…</summary>

`````text
поки забудь. View мені виглядає трохи заскладно.

Що якщо кожен тайл матиме горизонтальну гістограму по maturity, position, momentum, moat? Для moat я би хотів характеристику на скільки moat переконливий. Самі види moat можуть бути тільки в detail pane.
Тоді View не потрібне.

Як тобі ідея?
`````

</details>

<details>
<summary>14. давай реалізуємо так</summary>

`````text
давай реалізуємо так
`````

</details>

<details>
<summary>15. так</summary>

`````text
так
`````

</details>

<details>
<summary>16. я би хотів щоб кожна позиція в детальній картці була описана на основі чого такий висновок - коротким речення…</summary>

Вкладення:

- codex-clipboard-e0c2e0ee-5878-444d-8b52-b40587f33d85.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-e0c2e0ee-5878-444d-8b52-b40587f33d85.png

`````text
я би хотів щоб кожна позиція в детальній картці

була описана на основі чого такий висновок - коротким реченням і з посиланням на джерело. На разі наші джерела були 10K, investor day презентація, транскрипт останнього earnings call, сайт Datadog.

Оціни ідею спочатку
`````

</details>

<details>
<summary>17. Ок, тоді що від мене потрібно? До речі забув що у нас серед джерел був IBKR і Morningstart з IBKR Analyst jud…</summary>

`````text
Ок, тоді що від мене потрібно? До речі забув що у нас серед джерел був IBKR і Morningstart з IBKR

Analyst judgment based on company/product comparison - хто тут Analyst був?
`````

</details>

<details>
<summary>18. 10k - https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm#ibc9291ded86b4d588…</summary>

Вкладення:

- Datadog, Inc., Q1 2026 Earnings Call, May 7, 2026.pdf — /Users/tarasvynnychuk/Downloads/Datadog, Inc., Q1 2026 Earnings Call, May 7, 2026.pdf
- morningstar_report-636d1778e26a17cb57991caa.pdf — /Users/tarasvynnychuk/Downloads/morningstar_report-636d1778e26a17cb57991caa.pdf

`````text
10k - https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm#ibc9291ded86b4d5887357cb94c3fafb6_34


Datadog website - ти знаєш.
А по IBKR - ти робив у іншому чаті парсинг на сайті - можеш звідти взяти посилання чи потрібно знову тут вбудований браузер відкрити?
`````

</details>

<details>
<summary>19. важливе уточнення - напевно не варто хостити публічно пдв - це може бути порушенням авторських прав чи щось т…</summary>

`````text
важливе уточнення - напевно не варто хостити публічно пдв - це може бути порушенням авторських прав чи щось таке?
`````

</details>

<details>
<summary>20. Імплементуй</summary>

`````text
Імплементуй
`````

</details>

<details>
<summary>21. так</summary>

`````text
так
`````

</details>

<details>
<summary>22. поміняв модель</summary>

`````text
поміняв модель
`````

</details>

<details>
<summary>23. до речі з pdf можливо є сенс зберегти собі json? щоб потім було леше повертатись до першоджерел?</summary>

`````text
до речі з pdf можливо є сенс зберегти собі json? щоб потім було леше повертатись до першоджерел?
`````

</details>

<details>
<summary>24. Мені б хотілось для кожного посилання на джерело - якісь конкренті цитати з цього джерела при ховері</summary>

`````text
Мені б хотілось для кожного посилання на джерело - якісь конкренті цитати з цього джерела при ховері
`````

</details>

<details>
<summary>25. Я помітив що посилання на продукти на сайт datadog - не конркетні (напр. не https://www.datadoghq.com/product…</summary>

`````text
Я помітив що посилання на продукти на сайт datadog - не конркетні (напр. не https://www.datadoghq.com/product/cloud-siem/ а https://www.datadoghq.com/product/)
`````

</details>

<details>
<summary>26. ось тут дуже не зрозуміло. Цитата стосується усієї компанії, а ми наклали саме на cloud SIEM?? Не бійся робит…</summary>

Вкладення:

- codex-clipboard-ba7a03ca-8bca-4dd3-817b-a46125bab603.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-ba7a03ca-8bca-4dd3-817b-a46125bab603.png

`````text
ось тут дуже не зрозуміло. Цитата стосується усієї компанії, а ми наклали саме на cloud SIEM?? Не бійся робити цитати великими. Я хочу повноцінний текстовий контент з джерела, який пояснить мені оцінку.
`````

</details>

<details>
<summary>27. усі evidence мають бути collapsible і collapsled by default. (дуже важко навігувати всередині картки тепер DC…</summary>

`````text
усі evidence мають бути collapsible і collapsled by default. (дуже важко навігувати всередині картки тепер

DCF linkage - напевно забери.
`````

</details>

<details>
<summary>28. Чи можна застосувати правило, що якщо ми базуємось на earnings call чи 10K - цьому можна більше довіряти. Нас…</summary>

`````text
Чи можна застосувати правило, що якщо ми базуємось на earnings call чи 10K - цьому можна більше довіряти. Наступний після цього рівень довіри - Morning start. Найменше довіри - офіційний сайт datadog, investor day? Які є думки? Чи правильно я бачу ситуацію?
`````

</details>

<details>
<summary>29. як тоді далі рухатись? бо наприклад для Coud SIEM, Cloud Security, Code Security я бачу доволі високі оцінки,…</summary>

Вкладення:

- codex-clipboard-1bc25659-b5d7-4a67-a278-d1d1779aa274.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-1bc25659-b5d7-4a67-a278-d1d1779aa274.png

`````text
як тоді далі рухатись? бо наприклад для Coud SIEM, Cloud Security, Code Security я бачу доволі високі оцінки, але на скільки ці оцінки credible? Я хочу щоб ми вибудували стратегію - або ми занижуємо оцінку коли немає credibility, або ми якось підсвічуємо додатково параметер credibility
`````

</details>

<details>
<summary>30. Ok давай спробуємо застосувати це подивлюсь як це виглядатиме</summary>

`````text
Ok давай спробуємо застосувати це подивлюсь як це виглядатиме
`````

</details>

<details>
<summary>31. давай</summary>

`````text
давай
`````

</details>

<details>
<summary>32. ок давай спробуємо застосувати на усу</summary>

`````text
ок давай спробуємо застосувати на усу
`````

</details>

### 2026-07-24 · Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog,…

Session: `019f953a-f417-7bb3-a65a-0688b652531e` · prompts: 3

<details>
<summary>1. Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog, DDOG # ROLE Act as …</summary>

`````text
Prompt: Deep Business Model Analysis (Forensic Business Model Analysis)

Company: Datadog, DDOG

# ROLE

Act as a senior investment analyst and strategy consultant. Your task is to deconstruct the company's business model in order to separate the "story" from the real business. You need to understand not just what the company does, but the structural logic of how it generates and defends its profit.

# OBJECTIVE

Audit the business model by answering three fundamental questions:

1. Who exactly pays the company and for what specific value?
2. Why does the customer choose this company (price, brand, integration or habit)?
3. What prevents competitors from destroying this business's margin?

# INSTRUCTIONAL FLOW

# 1. Source deconstruction (Source Analysis)

Analyze official filings (10-K, Investor Presentation) and Earnings Calls:

- 10-K (Business & Risks): Identify the segments that actually produce profit, not just revenue. Isolate specific (not generic) risk factors: dependence on a single supplier, product, or regulator.
- Investor Presentation: Analyze the narrative. What does the company spotlight and what does it hide? Do they show unit economics, cohort data and retention?
- Earnings Call: Evaluate the tone of management's answers to hard questions about competition and margins.

# 2. Market environment and TAM

- Market structure: Is it an oligopoly or a fragmented commodity market?
- TAM (Total Addressable Market): Do not treat the TAM figure as a revenue forecast. Assess whether there is room to grow and whether the business model can capture the market without losing margin.
- Secular Trends: Is the company "running faster" thanks to long-term industry trends?

# 3. Archetype classification and KPIs

Determine the business model type and analyze the relevant metrics:

- SaaS/Subscription: Analyze NRR (Net Revenue Retention), Churn, Rule of 40 and Magic Number. Is ARR growth merely a byproduct of high SBC (stock-based compensation)?
- Usage-based/Cloud: Assess consumption volatility and the risk of customers optimizing their spend.
- Transaction/Fintech: Analyze TPV (Total Payment Volume) and Take rate dynamics. Is the company buying growth with discounts?
- Marketplace: Check liquidity, supply/demand balance and per-order unit economics.
- Manufacturer/Semi: Assess cyclicality, capacity utilization and R&D intensity.
- Retail/Distribution: Check inventory turns and Same-store sales (SSS).

# 4. Operating leverage and quality of revenue

- Cost structure: What is the share of fixed vs variable costs? Does margin expand with scale (operating leverage)?
- Quality of revenue: How recurring (recurring vs one-time) is it? Is it diversified?
- Scaling Limits: What exactly caps growth (demand, production, regulation or talent)?

# 5. Model vs Moat

- Explain whether this model is a "compounding machine" thanks to barriers, or a commodity business doomed to low margins because it is easy to copy.

# OUTPUT FORMAT

1. Essence of the profit engine: (A short description of the earnings formula).
2. KPI analysis: (Concrete numbers for the relevant archetype).
3. List of hidden risks: (Based on 10-K analysis and what was omitted from the presentation).
4. Verdict on scalability: Does growth expand margin or destroy it?

# BEHAVIORAL RULES

- Be skeptical of TAM numbers shown in presentations.
- Remember: if a business is easy to enter and easy to copy, profitability will inevitably fall.
- Use only facts and high-quality information from official primary sources.
`````

</details>

<details>
<summary>2. збережи це в md файл</summary>

`````text
збережи це в md файл
`````

</details>

<details>
<summary>3. поясни в контексті moat як працює Economies of scope - як велика кількість даних, що пройшла чи проходить чер…</summary>

`````text
поясни в контексті moat як працює Economies of scope - як велика кількість даних, що пройшла чи проходить через Datadog дає йому конкурентну перевагу? чи грає тут роль open telemetry? чи ідея якраз в тих evals (що Datadog навіть якщо отримує дані через opentelemetry має унікальні дані вирішених проблем де брали участь девелопери - і ще цікаво - long term враховуючи що ще більше коду буде написаним за допомогою AI і також інциденти будуть знаходитись за допомогою AI - чи не є це загрозою? чи я придумую і все одно кінцеве рішення за людиною - що робить use case evals досить валідним? і ще в цьому контексті - на скільки складно відтворити таку конкурентну перевагу конкурентам)?
`````

</details>

### 2026-07-25 · "The reported GAAP footprint is less flattering: operating margins were negative in four …

Session: `019f98c1-79e8-7ae2-911a-1dfe7dfc3234` · prompts: 4

<details>
<summary>1. "The reported GAAP footprint is less flattering: operating margins were negative in four of the five years th…</summary>

`````text
"The reported GAAP footprint is less flattering: operating margins were negative in four of the five years through 2025. For an intangible-heavy software company, however, expensing all R&D immediately understates both earnings and invested capital. Capitalizing R&D over five years while retaining stock-based compensation as an expense produces indicative ROIC of 40%, 34%, 27%, 23%, and 20% for 2021–2025. A shorter three-year R&D life still produces approximately 17% for 2025."

1. Це типово для sass що GAAP дуже низький чи тільки для DDOG?
2. Ідея в тому що будь-який R&D варто розраховувати концептуально як капітальні витрати, які насправді "амортизуються", тобто втрачають цінність впродовж наступних n років?
3. Чому обрано амортизувати саме 5 років? а не 3 чи 8?
`````

</details>

<details>
<summary>2. чому тоді так сильно це впливає на показники? (той факт, що R&D не розраховується, як витрата, а як свого род…</summary>

`````text
чому тоді так сильно це впливає на показники? (той факт, що R&D не розраховується, як витрата, а як свого роду Capex)? Ідея в тому - що це на просто витрата на умовну зарплату, а також створення активу, який додатково генерує дохід?
`````

</details>

<details>
<summary>3. Розклади свою механіку розрахунку ROIC</summary>

`````text
Розклади свою механіку розрахунку ROIC
`````

</details>

<details>
<summary>4. що означає "не виключає SBC як економічну вартість."?</summary>

`````text
що означає "не виключає SBC як економічну вартість."?
`````

</details>

### 2026-07-25 · порівняй із іншою аналітикою: мені виглядає що 95% схожий результат, однак знайди відмінн…

Session: `019f990a-ca70-7822-b3da-117128942a0d` · prompts: 3

<details>
<summary>1. порівняй із іншою аналітикою: мені виглядає що 95% схожий результат, однак знайди відмінності та моменти які …</summary>

Вкладення:

- 0. Фінансовий слід MOAT (Step 1 — перевірка перед класифікацією) Тут одразу нюа… — /Users/tarasvynnychuk/.codex/attachments/72292895-e3a3-4af7-a909-b007041b8518/pasted-text.txt

`````text
порівняй із іншою аналітикою:

мені виглядає що 95% схожий результат, однак знайди відмінності та моменти які можна добавити із попереднього аналізу
`````

</details>

<details>
<summary>2. Мені подобаються твої висновки. Сформулюй кінцевий результат покладаючись в першу чергу на твій первинний ана…</summary>

`````text
Мені подобаються твої висновки. Сформулюй кінцевий результат покладаючись в першу чергу на твій первинний аналіз, з іншого можна добавити те, що є валідним, додає додатковий контекст і тд. Кінцевий результат - все ж англійською
`````

</details>

<details>
<summary>3. Завантаж в notion (workspace - Investments) - під Datadog</summary>

`````text
Завантаж в notion (workspace - Investments) - під Datadog
`````

</details>

### 2026-07-25 · Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog,…

Session: `019f993c-6993-7bd2-8e5a-bd6a9815d45b` · prompts: 3

<details>
<summary>1. Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog, DDOG # ROLE Act as …</summary>

`````text
Prompt: Deep Business Model Analysis (Forensic Business Model Analysis)

Company: Datadog, DDOG

# ROLE

Act as a senior investment analyst and strategy consultant. Your task is to deconstruct the company's business model in order to separate the "story" from the real business. You need to understand not just what the company does, but the structural logic of how it generates and defends its profit.

# OBJECTIVE

Audit the business model by answering three fundamental questions:

1. Who exactly pays the company and for what specific value?
2. Why does the customer choose this company (price, brand, integration or habit)?
3. What prevents competitors from destroying this business's margin?

# INSTRUCTIONAL FLOW

# 1. Source deconstruction (Source Analysis)

Analyze official filings (10-K, Investor Presentation) and Earnings Calls:

- 10-K (Business & Risks): Identify the segments that actually produce profit, not just revenue. Isolate specific (not generic) risk factors: dependence on a single supplier, product, or regulator.
- Investor Presentation: Analyze the narrative. What does the company spotlight and what does it hide? Do they show unit economics, cohort data and retention?
- Earnings Call: Evaluate the tone of management's answers to hard questions about competition and margins.

# 2. Market environment and TAM

- Market structure: Is it an oligopoly or a fragmented commodity market?
- TAM (Total Addressable Market): Do not treat the TAM figure as a revenue forecast. Assess whether there is room to grow and whether the business model can capture the market without losing margin.
- Secular Trends: Is the company "running faster" thanks to long-term industry trends?

# 3. Archetype classification and KPIs

Determine the business model type and analyze the relevant metrics:

- SaaS/Subscription: Analyze NRR (Net Revenue Retention), Churn, Rule of 40 and Magic Number. Is ARR growth merely a byproduct of high SBC (stock-based compensation)?
- Usage-based/Cloud: Assess consumption volatility and the risk of customers optimizing their spend.
- Transaction/Fintech: Analyze TPV (Total Payment Volume) and Take rate dynamics. Is the company buying growth with discounts?
- Marketplace: Check liquidity, supply/demand balance and per-order unit economics.
- Manufacturer/Semi: Assess cyclicality, capacity utilization and R&D intensity.
- Retail/Distribution: Check inventory turns and Same-store sales (SSS).

# 4. Operating leverage and quality of revenue

- Cost structure: What is the share of fixed vs variable costs? Does margin expand with scale (operating leverage)?
- Quality of revenue: How recurring (recurring vs one-time) is it? Is it diversified?
- Scaling Limits: What exactly caps growth (demand, production, regulation or talent)?

# 5. Model vs Moat

- Explain whether this model is a "compounding machine" thanks to barriers, or a commodity business doomed to low margins because it is easy to copy.

# OUTPUT FORMAT

1. Essence of the profit engine: (A short description of the earnings formula).
2. KPI analysis: (Concrete numbers for the relevant archetype).
3. List of hidden risks: (Based on 10-K analysis and what was omitted from the presentation).
4. Verdict on scalability: Does growth expand margin or destroy it?

# BEHAVIORAL RULES

- Be skeptical of TAM numbers shown in presentations.
- Remember: if a business is easy to enter and easy to copy, profitability will inevitably fall.
- Use only facts and high-quality information from official primary sources.
`````

</details>

<details>
<summary>2. Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторін…</summary>

`````text
Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторінку в notion).
`````

</details>

<details>
<summary>3. Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати вес…</summary>

`````text
Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати весь $915 млн як повністю доступний акціонерам cash earnings не можна. - це означає що FCF margin не можна довіряти?
`````

</details>

### 2026-07-25 · Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog,…

Session: `019f9967-f528-7b60-b9b1-2097cc7faeb6` · prompts: 5

<details>
<summary>1. Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog, DDOG # ROLE Act as …</summary>

`````text
Prompt: Deep Business Model Analysis (Forensic Business Model Analysis)

Company: Datadog, DDOG

# ROLE

Act as a senior investment analyst and strategy consultant. Your task is to deconstruct the company's business model in order to separate the "story" from the real business. You need to understand not just what the company does, but the structural logic of how it generates and defends its profit.

# OBJECTIVE

Audit the business model by answering three fundamental questions:

1. Who exactly pays the company and for what specific value?
2. Why does the customer choose this company (price, brand, integration or habit)?
3. What prevents competitors from destroying this business's margin?

# INSTRUCTIONAL FLOW

# 1. Source deconstruction (Source Analysis)

Analyze official filings (10-K, Investor Presentation) and Earnings Calls:

- 10-K (Business & Risks): Identify the segments that actually produce profit, not just revenue. Isolate specific (not generic) risk factors: dependence on a single supplier, product, or regulator.
- Investor Presentation: Analyze the narrative. What does the company spotlight and what does it hide? Do they show unit economics, cohort data and retention?
- Earnings Call: Evaluate the tone of management's answers to hard questions about competition and margins.

# 2. Market environment and TAM

- Market structure: Is it an oligopoly or a fragmented commodity market?
- TAM (Total Addressable Market): Do not treat the TAM figure as a revenue forecast. Assess whether there is room to grow and whether the business model can capture the market without losing margin.
- Secular Trends: Is the company "running faster" thanks to long-term industry trends?

# 3. Archetype classification and KPIs

Determine the business model type and analyze the relevant metrics:

- SaaS/Subscription: Analyze NRR (Net Revenue Retention), Churn, Rule of 40 and Magic Number. Is ARR growth merely a byproduct of high SBC (stock-based compensation)?
- Usage-based/Cloud: Assess consumption volatility and the risk of customers optimizing their spend.
- Transaction/Fintech: Analyze TPV (Total Payment Volume) and Take rate dynamics. Is the company buying growth with discounts?
- Marketplace: Check liquidity, supply/demand balance and per-order unit economics.
- Manufacturer/Semi: Assess cyclicality, capacity utilization and R&D intensity.
- Retail/Distribution: Check inventory turns and Same-store sales (SSS).

# 4. Operating leverage and quality of revenue

- Cost structure: What is the share of fixed vs variable costs? Does margin expand with scale (operating leverage)?
- Quality of revenue: How recurring (recurring vs one-time) is it? Is it diversified?
- Scaling Limits: What exactly caps growth (demand, production, regulation or talent)?

# 5. Model vs Moat

- Explain whether this model is a "compounding machine" thanks to barriers, or a commodity business doomed to low margins because it is easy to copy.

# OUTPUT FORMAT

1. Essence of the profit engine: (A short description of the earnings formula).
2. KPI analysis: (Concrete numbers for the relevant archetype).
3. List of hidden risks: (Based on 10-K analysis and what was omitted from the presentation).
4. Verdict on scalability: Does growth expand margin or destroy it?

# BEHAVIORAL RULES

- Be skeptical of TAM numbers shown in presentations.
- Remember: if a business is easy to enter and easy to copy, profitability will inevitably fall.
- Use only facts and high-quality information from official primary sources.
`````

</details>

<details>
<summary>2. Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторін…</summary>

`````text
Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторінку в notion).
`````

</details>

<details>
<summary>3. Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати вес…</summary>

`````text
Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати весь $915 млн як повністю доступний акціонерам cash earnings не можна. - це означає що FCF margin не можна довіряти?
`````

</details>

<details>
<summary>4. Поясни детально змішану subscription/usage модель Datadog</summary>

`````text
Поясни детально змішану subscription/usage модель Datadog
`````

</details>

<details>
<summary>5. Поясни цю фразу **FCF overstates owner economics.** SBC is added back to operating cash flow while shareholde…</summary>

`````text
Поясни цю фразу

**FCF overstates owner economics.** SBC is added back to operating cash flow while shareholders bear dilution. FY2025 also reported $108 million of net income despite a $44 million operating loss because other income—primarily interest—was $171 million. Accounting profitability remains partly treasury-yield-supported.
`````

</details>

### 2026-07-25 · Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog,…

Session: `019f9981-f5c4-7ac2-8314-bf7a8499b4a4` · prompts: 10

<details>
<summary>1. Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog, DDOG # ROLE Act as …</summary>

`````text
Prompt: Deep Business Model Analysis (Forensic Business Model Analysis)

Company: Datadog, DDOG

# ROLE

Act as a senior investment analyst and strategy consultant. Your task is to deconstruct the company's business model in order to separate the "story" from the real business. You need to understand not just what the company does, but the structural logic of how it generates and defends its profit.

# OBJECTIVE

Audit the business model by answering three fundamental questions:

1. Who exactly pays the company and for what specific value?
2. Why does the customer choose this company (price, brand, integration or habit)?
3. What prevents competitors from destroying this business's margin?

# INSTRUCTIONAL FLOW

# 1. Source deconstruction (Source Analysis)

Analyze official filings (10-K, Investor Presentation) and Earnings Calls:

- 10-K (Business & Risks): Identify the segments that actually produce profit, not just revenue. Isolate specific (not generic) risk factors: dependence on a single supplier, product, or regulator.
- Investor Presentation: Analyze the narrative. What does the company spotlight and what does it hide? Do they show unit economics, cohort data and retention?
- Earnings Call: Evaluate the tone of management's answers to hard questions about competition and margins.

# 2. Market environment and TAM

- Market structure: Is it an oligopoly or a fragmented commodity market?
- TAM (Total Addressable Market): Do not treat the TAM figure as a revenue forecast. Assess whether there is room to grow and whether the business model can capture the market without losing margin.
- Secular Trends: Is the company "running faster" thanks to long-term industry trends?

# 3. Archetype classification and KPIs

Determine the business model type and analyze the relevant metrics:

- SaaS/Subscription: Analyze NRR (Net Revenue Retention), Churn, Rule of 40 and Magic Number. Is ARR growth merely a byproduct of high SBC (stock-based compensation)?
- Usage-based/Cloud: Assess consumption volatility and the risk of customers optimizing their spend.
- Transaction/Fintech: Analyze TPV (Total Payment Volume) and Take rate dynamics. Is the company buying growth with discounts?
- Marketplace: Check liquidity, supply/demand balance and per-order unit economics.
- Manufacturer/Semi: Assess cyclicality, capacity utilization and R&D intensity.
- Retail/Distribution: Check inventory turns and Same-store sales (SSS).

# 4. Operating leverage and quality of revenue

- Cost structure: What is the share of fixed vs variable costs? Does margin expand with scale (operating leverage)?
- Quality of revenue: How recurring (recurring vs one-time) is it? Is it diversified?
- Scaling Limits: What exactly caps growth (demand, production, regulation or talent)?

# 5. Model vs Moat

- Explain whether this model is a "compounding machine" thanks to barriers, or a commodity business doomed to low margins because it is easy to copy.

# OUTPUT FORMAT

1. Essence of the profit engine: (A short description of the earnings formula).
2. KPI analysis: (Concrete numbers for the relevant archetype).
3. List of hidden risks: (Based on 10-K analysis and what was omitted from the presentation).
4. Verdict on scalability: Does growth expand margin or destroy it?

# BEHAVIORAL RULES

- Be skeptical of TAM numbers shown in presentations.
- Remember: if a business is easy to enter and easy to copy, profitability will inevitably fall.
- Use only facts and high-quality information from official primary sources.
`````

</details>

<details>
<summary>2. Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторін…</summary>

`````text
Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторінку в notion).
`````

</details>

<details>
<summary>3. Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати вес…</summary>

`````text
Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати весь $915 млн як повністю доступний акціонерам cash earnings не можна. - це означає що FCF margin не можна довіряти?
`````

</details>

<details>
<summary>4. Поясни детально змішану subscription/usage модель Datadog</summary>

`````text
Поясни детально змішану subscription/usage модель Datadog
`````

</details>

<details>
<summary>5. Поясни цю фразу **FCF overstates owner economics.** SBC is added back to operating cash flow while shareholde…</summary>

`````text
Поясни цю фразу

**FCF overstates owner economics.** SBC is added back to operating cash flow while shareholders bear dilution. FY2025 also reported $108 million of net income despite a $44 million operating loss because other income—primarily interest—was $171 million. Accounting profitability remains partly treasury-yield-supported.
`````

</details>

<details>
<summary>6. Порівняй із цією аналітикою:</summary>

Вкладення:

- # Форензик-аналіз бізнес-моделі Datadog (DDOG) *Дані — 10-K за FY2025 (подано лю…: /Users/tarasvynnychuk/.codex/attachments/d2984c1c-17bf-49e2-974a-da4e8a9c739a/pasted-text.txt

`````text
Порівняй із цією аналітикою:
`````

</details>

<details>
<summary>7. створи в notion окрему від moat сторінку - Business Model Analysis додай туди свій аналіз із тими доповненням…</summary>

`````text
створи в notion окрему від moat сторінку - Business Model Analysis

додай туди свій аналіз із тими доповненнями, що мають сенс із твоєї попередньої відповіді. Ціль - мати два окремих документи - один business model, інший - moat
`````

</details>

<details>
<summary>8. перероби англійською для консистентності</summary>

`````text
перероби англійською для консистентності
`````

</details>

<details>
<summary>9. перероби англійською для консистентності. І ще ти памєятаєш оригінальний промпт? слідуй йому</summary>

`````text
перероби англійською для консистентності. І ще ти памєятаєш оригінальний промпт? слідуй йому
`````

</details>

<details>
<summary>10. перероби англійською для консистентності. І ще ти памєятаєш оригінальний промпт? слідуй його структурі</summary>

`````text
перероби англійською для консистентності. І ще ти памєятаєш оригінальний промпт? слідуй його структурі
`````

</details>

### 2026-07-25 · Як Datadog використовує внутрішні LLM і для чого?

Session: `019f9b46-0466-7961-a4b6-5b4d0d2237dd` · prompts: 1

<details>
<summary>1. Як Datadog використовує внутрішні LLM і для чого?</summary>

`````text
Як Datadog використовує внутрішні LLM і для чого?
`````

</details>

### 2026-07-26 · проаналізуй згенеровані нами висновки по business model і moat з notion. і проаналізуй чи…

Session: `019f9e3d-2f31-7cc2-a36d-279120695938` · prompts: 7

<details>
<summary>1. проаналізуй згенеровані нами висновки по business model і moat з notion. і проаналізуй чи є щось що згідно ре…</summary>

`````text
проаналізуй згенеровані нами висновки по business model і moat з notion. і проаналізуй чи є щось що згідно результатів цього аналізу варто поміняти на нашій product map?
`````

</details>

<details>
<summary>2. product map - не у notion - це наш проект в git</summary>

`````text
product map - не у notion - це наш проект в git
`````

</details>

<details>
<summary>3. Ок, мені подобається. Застосуй зміни</summary>

`````text
Ок, мені подобається. Застосуй зміни
`````

</details>

<details>
<summary>4. Я хочу оцінити менеджмент сам за критеріями: послідовність, чесність, результативність. Для цього хочу перечи…</summary>

`````text
Я хочу оцінити менеджмент сам за критеріями: послідовність, чесність, результативність. Для цього хочу перечитати транскрипти earnings calls. Які пропонуєш взяти? останні 3 роки? останні 3 квартали? якось по іншом? більше років?
`````

</details>

<details>
<summary>5. сорі тупонув)) так, збережи план і застосуй зміни. (останнє повідомлення ігноруй)</summary>

`````text
сорі тупонув)) так, збережи план і застосуй зміни. (останнє повідомлення ігноруй)
`````

</details>

<details>
<summary>6. commit and push</summary>

`````text
commit and push
`````

</details>

<details>
<summary>7. merge to main (I want to see the last version on prod)</summary>

`````text
merge to main (I want to see the last version on prod)
`````

</details>

### 2026-07-26 · склади список наявних листів до акціонерів від менеджменту Datadog

Session: `019f9e3f-35e1-7f83-8399-c201b7fb7dcc` · prompts: 5

<details>
<summary>1. склади список наявних листів до акціонерів від менеджменту Datadog</summary>

`````text
склади список наявних листів до акціонерів від менеджменту Datadog
`````

</details>

<details>
<summary>2. на скільки така ситуація характерна для великого sotware?</summary>

`````text
на скільки така ситуація характерна для великого sotware?
`````

</details>

<details>
<summary>3. ще я помітив, що часто на earnings call присутній і відповідає не тільки Olivier Pomel - це теж нормально? і …</summary>

`````text
ще я помітив, що часто на earnings call присутній і відповідає не тільки Olivier Pomel - це теж нормально? і на скільки типово?
`````

</details>

<details>
<summary>4. Я хочу оцінити менеджмент сам за критеріями: послідовність, чесність, результативність. Для цього хочу перечи…</summary>

`````text
Я хочу оцінити менеджмент сам за критеріями: послідовність, чесність, результативність. Для цього хочу перечитати транскрипти earnings calls. Які пропонуєш взяти? останні 3 роки? останні 3 квартали? якось по іншом? більше років?
`````

</details>

<details>
<summary>5. на жаль в мене немає сьогодні стільки часу. треба вибрати 3-4</summary>

`````text
на жаль в мене немає сьогодні стільки часу. треба вибрати 3-4
`````

</details>

### 2026-07-26 · AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and …

Session: `019f9e69-2561-7110-8965-af1a51062a12` · prompts: 1

<details>
<summary>1. AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and Olivier Pomel # ROLE…</summary>

`````text
AI prompt for management and CEO analysis

Company: Datadog, DDOG
CEO: Alexis Lê‑Quôc and Olivier Pomel

# ROLE

Act as a Senior Equity Analyst and Corporate Governance specialist. Your task is to conduct a deep audit of the company's CEO and management. Evaluate not charisma or slide-deck polish, but patterns of behavior, the quality of decisions made, and the structure of incentives.

# OBJECTIVE

Determine whether the CEO is an "A-Player" (per Geoff Smart's methodology), whether they think like a business owner, and whether they can drive long-term growth in intrinsic value.

# ALGORITHM AND SOURCES

# 1. Building a "Scorecard" and analyzing execution (the "WHO" method)

Action: Compare management's promises from 2–3 years ago (from archived Earnings Calls) with today's facts in the 10-K.

Analysis: Did the CEO deliver specific "Outcomes"? (E.g., promise to enter new markets, reduce costs, or launch a product).

Verdict: Is the CEO consistent in their actions, or do they keep rewriting the narrative when things go wrong?

# 2. Incentives and "Skin in the Game" (Proxy Statement DEF 14A)

Ownership: What % of shares does the CEO actually own? Have they bought shares on the open market recently?

Compensation: Are bonuses tied to short-term metrics (share price, EPS) or to long-term business quality (ROIC, FCF, Net Retention)?

Risk: Is management's lifestyle funded at shareholder expense (excessive perks, jets, etc.)?

# 3. Communication patterns (Earnings Calls & Interviews)

Analyze the last 4 Earnings Call transcripts and 2–3 video interviews:

CEO focus: What do they talk about more — customers, product and scaling, or the share price and the "unfair market valuation"?

Honesty: How does the CEO answer analysts' hard questions? Do they admit mistakes openly or use aggressive defensiveness and excuses?

Maturity test: Cite examples of unpopular CEO decisions over the past year (cost cuts, walking away from toxic growth).

# 4. Talent policy and team stability (the "WHO" method)

Stability: Check turnover among the top management (CFO, COO, CTO). Were there sudden departures over the past 2 years?

Ability to hire the best: Who joined the team recently? Are they "A-Players" with industry experience, or simply loyal executors?

Culture: Does the CEO talk about their team and a culture of frugality, or only about their own "I"?

# FINAL CONCLUSION (MANAGEMENT VERDICT)

Provide an assessment of management on the following criteria:

CEO type: (Owner / Hired hand / Value destroyer).

Skin in the Game: (High / Medium / Low).

Capital allocation quality: (What is management spending on — buybacks at the peak, dividends, or R&D?).

Main Red Flag: (The biggest risk in management behavior or incentives).

Investor quote: Find a fitting Charlie Munger or Warren Buffett quote that best illustrates this specific CEO's behavior.

# BEHAVIORAL RULES

Facts only: compare words (transcripts) with numbers (SEC filings).

No trust in "nice words" in presentations — look for confirmation through actions.

Cite sources and dates of quoted CEO statements.
`````

</details>

### 2026-07-26 · AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and …

Session: `019f9f28-af48-7831-8d6e-3f88e2d071da` · prompts: 5

<details>
<summary>1. AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and Olivier Pomel # ROLE…</summary>

`````text
AI prompt for management and CEO analysis

Company: Datadog, DDOG
CEO: Alexis Lê‑Quôc and Olivier Pomel

# ROLE

Act as a Senior Equity Analyst and Corporate Governance specialist. Your task is to conduct a deep audit of the company's CEO and management. Evaluate not charisma or slide-deck polish, but patterns of behavior, the quality of decisions made, and the structure of incentives.

# OBJECTIVE

Determine whether the CEO is an "A-Player" (per Geoff Smart's methodology), whether they think like a business owner, and whether they can drive long-term growth in intrinsic value.

# ALGORITHM AND SOURCES

# 1. Building a "Scorecard" and analyzing execution (the "WHO" method)

Action: Compare management's promises from 2–3 years ago (from archived Earnings Calls) with today's facts in the 10-K.

Analysis: Did the CEO deliver specific "Outcomes"? (E.g., promise to enter new markets, reduce costs, or launch a product).

Verdict: Is the CEO consistent in their actions, or do they keep rewriting the narrative when things go wrong?

# 2. Incentives and "Skin in the Game" (Proxy Statement DEF 14A)

Ownership: What % of shares does the CEO actually own? Have they bought shares on the open market recently?

Compensation: Are bonuses tied to short-term metrics (share price, EPS) or to long-term business quality (ROIC, FCF, Net Retention)?

Risk: Is management's lifestyle funded at shareholder expense (excessive perks, jets, etc.)?

# 3. Communication patterns (Earnings Calls & Interviews)

Analyze the last 4 Earnings Call transcripts and 2–3 video interviews:

CEO focus: What do they talk about more — customers, product and scaling, or the share price and the "unfair market valuation"?

Honesty: How does the CEO answer analysts' hard questions? Do they admit mistakes openly or use aggressive defensiveness and excuses?

Maturity test: Cite examples of unpopular CEO decisions over the past year (cost cuts, walking away from toxic growth).

# 4. Talent policy and team stability (the "WHO" method)

Stability: Check turnover among the top management (CFO, COO, CTO). Were there sudden departures over the past 2 years?

Ability to hire the best: Who joined the team recently? Are they "A-Players" with industry experience, or simply loyal executors?

Culture: Does the CEO talk about their team and a culture of frugality, or only about their own "I"?

# FINAL CONCLUSION (MANAGEMENT VERDICT)

Provide an assessment of management on the following criteria:

CEO type: (Owner / Hired hand / Value destroyer).

Skin in the Game: (High / Medium / Low).

Capital allocation quality: (What is management spending on — buybacks at the peak, dividends, or R&D?).

Main Red Flag: (The biggest risk in management behavior or incentives).

Investor quote: Find a fitting Charlie Munger or Warren Buffett quote that best illustrates this specific CEO's behavior.

# BEHAVIORAL RULES

Facts only: compare words (transcripts) with numbers (SEC filings).

No trust in "nice words" in presentations — look for confirmation through actions.

Cite sources and dates of quoted CEO statements.
`````

</details>

<details>
<summary>2. порівняй із цим аналізом:</summary>

Вкладення:

- 1. Scorecard — обіцянки vs. факти (метод "WHO") Що обіцяли у 2022–2023. У період…: /Users/tarasvynnychuk/.codex/attachments/afed0897-8e31-4475-b160-39e11f4ad7a5/pasted-text.txt

`````text
порівняй із цим аналізом:
`````

</details>

<details>
<summary>3. Ок використай твій аналіз як основа. Можеш добавити до нього доповнення із наданого аналізу. Збережи структур…</summary>

`````text
Ок використай твій аналіз як основа. Можеш добавити до нього доповнення із наданого аналізу. Збережи структуру яка була задана в оригінальному промпті. І збережи в notion як окрему сторінку
`````

</details>

<details>
<summary>4. поміняй що було англійською</summary>

`````text
поміняй що було англійською
`````

</details>

<details>
<summary>5. я мав на увазі щоб було усе повнісб англійсбкою</summary>

`````text
я мав на увазі щоб було усе повнісб англійсбкою
`````

</details>

### 2026-07-26 · AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and …

Session: `019f9f2b-3f0c-7d83-85ad-a3e2397baf00` · prompts: 7

<details>
<summary>1. AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and Olivier Pomel # ROLE…</summary>

`````text
AI prompt for management and CEO analysis

Company: Datadog, DDOG
CEO: Alexis Lê‑Quôc and Olivier Pomel

# ROLE

Act as a Senior Equity Analyst and Corporate Governance specialist. Your task is to conduct a deep audit of the company's CEO and management. Evaluate not charisma or slide-deck polish, but patterns of behavior, the quality of decisions made, and the structure of incentives.

# OBJECTIVE

Determine whether the CEO is an "A-Player" (per Geoff Smart's methodology), whether they think like a business owner, and whether they can drive long-term growth in intrinsic value.

# ALGORITHM AND SOURCES

# 1. Building a "Scorecard" and analyzing execution (the "WHO" method)

Action: Compare management's promises from 2–3 years ago (from archived Earnings Calls) with today's facts in the 10-K.

Analysis: Did the CEO deliver specific "Outcomes"? (E.g., promise to enter new markets, reduce costs, or launch a product).

Verdict: Is the CEO consistent in their actions, or do they keep rewriting the narrative when things go wrong?

# 2. Incentives and "Skin in the Game" (Proxy Statement DEF 14A)

Ownership: What % of shares does the CEO actually own? Have they bought shares on the open market recently?

Compensation: Are bonuses tied to short-term metrics (share price, EPS) or to long-term business quality (ROIC, FCF, Net Retention)?

Risk: Is management's lifestyle funded at shareholder expense (excessive perks, jets, etc.)?

# 3. Communication patterns (Earnings Calls & Interviews)

Analyze the last 4 Earnings Call transcripts and 2–3 video interviews:

CEO focus: What do they talk about more — customers, product and scaling, or the share price and the "unfair market valuation"?

Honesty: How does the CEO answer analysts' hard questions? Do they admit mistakes openly or use aggressive defensiveness and excuses?

Maturity test: Cite examples of unpopular CEO decisions over the past year (cost cuts, walking away from toxic growth).

# 4. Talent policy and team stability (the "WHO" method)

Stability: Check turnover among the top management (CFO, COO, CTO). Were there sudden departures over the past 2 years?

Ability to hire the best: Who joined the team recently? Are they "A-Players" with industry experience, or simply loyal executors?

Culture: Does the CEO talk about their team and a culture of frugality, or only about their own "I"?

# FINAL CONCLUSION (MANAGEMENT VERDICT)

Provide an assessment of management on the following criteria:

CEO type: (Owner / Hired hand / Value destroyer).

Skin in the Game: (High / Medium / Low).

Capital allocation quality: (What is management spending on — buybacks at the peak, dividends, or R&D?).

Main Red Flag: (The biggest risk in management behavior or incentives).

Investor quote: Find a fitting Charlie Munger or Warren Buffett quote that best illustrates this specific CEO's behavior.

# BEHAVIORAL RULES

Facts only: compare words (transcripts) with numbers (SEC filings).

No trust in "nice words" in presentations — look for confirmation through actions.

Cite sources and dates of quoted CEO statements.
`````

</details>

<details>
<summary>2. Поясни ось цей пункт Outcome 4: Enter more regulated government workloads On February 13, 2024, management st…</summary>

`````text
Поясни ось цей пункт
Outcome 4: Enter more regulated government workloads
On February 13, 2024, management stated that it intended to achieve FedRAMP High and IL5 authorization.
FedRAMP High was achieved on May 6, 2026 after what Datadog called a multi-year investment. I found no evidence that IL5 was complete by the cut-off date. [FedRAMP announcement](https://investors.datadoghq.com/news-releases/news-release-details/datadog-government-achieves-fedrampr-high-certification)
**Verdict: partially delivered.** The central commercial gate—FedRAMP High—was completed; IL5 remains open.
`````

</details>

<details>
<summary>3. Поясни цей пункт. Що таке RSUs and PSUs ? Outcome 5: Convert growth into per-share owner earnings This is the…</summary>

`````text
Поясни цей пункт. Що таке RSUs and PSUs ?

Outcome 5: Convert growth into per-share owner earnings
This is the weak point.
In 2025:
Free cash flow was approximately **$915 million**.
Stock-based compensation was **$774 million**, or **22.6% of revenue**.
GAAP operating loss was **$44 million**, versus $768 million of non-GAAP operating income.
Year-end shares increased **3.0%** in one year and **10.4%** from year-end 2022.
Unvested RSUs and PSUs reached 16.7 million shares.
A conservative economic sanity check—FCF less total stock compensation—produces only about **$141 million**. That is not a GAAP metric and double-counts some timing effects, but it illustrates how different the cash-flow presentation is from per-share economics. [2025 10-K](https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm)
**Verdict: incomplete.** Datadog has proven that it can grow and generate cash. It has not yet fully proven that this growth converts efficiently into intrinsic value per diluted share.
`````

</details>

<details>
<summary>4. поясни 6. Governance risk дуже детально (поки нічого там не розумію взагалі)</summary>

`````text
поясни
6. Governance risk дуже детально (поки нічого там не розумію взагалі)
`````

</details>

<details>
<summary>5. продовжуй (інтернет вимкнувся)</summary>

`````text
продовжуй (інтернет вимкнувся)
`````

</details>

<details>
<summary>6. почин з пояснення що таке клас А і Б</summary>

`````text
почин з пояснення що таке клас А і Б
`````

</details>

<details>
<summary>7. Ok, пояснм тді ще раз про 4. governance</summary>

`````text
Ok, пояснм тді ще раз про 4. governance
`````

</details>

### 2026-07-27 · Давай тепер зробимо на верхньому рівні 2 окремі вкладки - product map та business model &…

Session: `019fa23b-390a-7e00-8175-11f856dad219` · prompts: 7

<details>
<summary>1. Давай тепер зробимо на верхньому рівні 2 окремі вкладки - product map та business model & moat. В product map…</summary>

`````text
Давай тепер зробимо на верхньому рівні 2 окремі вкладки - product map та business model & moat. В product map ми показуємо горизонтальні гістограми по кожному продукту - давай краще будемо показувати їх тільки якщо enabled спеціальний toggle
`````

</details>

<details>
<summary>2. commit and push to main</summary>

`````text
commit and push to main
`````

</details>

<details>
<summary>3. product scorecards дуже непомітний підсвіди краще його</summary>

`````text
product scorecards дуже непомітний підсвіди краще його
`````

</details>

<details>
<summary>4. трошки засильно</summary>

`````text
трошки засильно
`````

</details>

<details>
<summary>5. ще менше</summary>

`````text
ще менше
`````

</details>

<details>
<summary>6. супер commit and push to main</summary>

`````text
супер commit and push to main
`````

</details>

<details>
<summary>7. https://tarvyn.github.io/hypothesis/datadog/product-map/#product-map /datadog/product-map/#product-map path /…</summary>

`````text
https://tarvyn.github.io/hypothesis/datadog/product-map/#product-map

/datadog/product-map/#product-map

path /product-map/ уже зайвий Зроби так щоб було

https://tarvyn.github.io/hypothesis/datadog/#product-map
`````

</details>

### 2026-07-27 · Розкажи як goodwil може списатись компанією як безповортні втрати. В чому ризик goodwil і…

Session: `019fa496-4a62-74e0-833d-591522e400ee` · prompts: 11

<details>
<summary>1. Розкажи як goodwil може списатись компанією як безповортні втрати. В чому ризик goodwil і якісь приклади таки…</summary>

`````text
Розкажи як goodwil може списатись компанією як безповортні втрати. В чому ризик goodwil і якісь приклади таких списань (коли це відбувається і тд)
`````

</details>

<details>
<summary>2. в чому різниця грошовго та негрошового списання?</summary>

`````text
в чому різниця грошовго та негрошового списання?
`````

</details>

<details>
<summary>3. втрати по гудвіл - завжди негрошове списання?</summary>

`````text
втрати по гудвіл - завжди негрошове списання?
`````

</details>

<details>
<summary>4. якщо списали гудвіл - як це відображається на показниках - вартість компанії зменшилась? якось впилнуло на ба…</summary>

`````text
якщо списали гудвіл - як це відображається на показниках - вартість компанії зменшилась? якось впилнуло на баланс?
`````

</details>

<details>
<summary>5. тобто списання по гудвіл зменшує базу оподаткування?</summary>

`````text
тобто списання по гудвіл зменшує базу оподаткування?
`````

</details>

<details>
<summary>6. ок я пройшлов модуль по аналізу балансу. Хочу перевірити чи можу я читати звіт по балансу. Зведи мені таблицю…</summary>

`````text
ок я пройшлов модуль по аналізу балансу. Хочу перевірити чи можу я читати звіт по балансу. Зведи мені таблицю чи таблиці по балансу Datadog в динаміці за всі роки. Також по кожному році дай нотатки (які стосуються саме балансу). Поки без твоєї аналітики (хочу спочатку попрактикуватись самому)
`````

</details>

<details>
<summary>7. добав ще виручку в таблиці</summary>

Вкладення:

- codex-clipboard-6981b84e-0e2a-44cd-bd95-0623914f4699.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-6981b84e-0e2a-44cd-bd95-0623914f4699.png

`````text
добав ще виручку в таблиці
`````

</details>

<details>
<summary>8. і прибуток додай</summary>

Вкладення:

- codex-clipboard-c14b7733-ff3a-42a6-bba2-69676bc9adf2.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-c14b7733-ff3a-42a6-bba2-69676bc9adf2.png

`````text
і прибуток додай
`````

</details>

<details>
<summary>9. видай ангійською (в дужках українською)</summary>

`````text
видай ангійською (в дужках українською)
`````

</details>

<details>
<summary>10. А нотатки якісь були по активам?</summary>

`````text
А нотатки якісь були по активам?
`````

</details>

<details>
<summary>11. Ну і після цього як закінчиш дотай так само пасиви</summary>

`````text
Ну і після цього як закінчиш дотай так само пасиви
`````

</details>

### 2026-07-27 · Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side …

Session: `019fa4d4-8dd4-7f90-8f2d-918aa3cc2d8b` · prompts: 1

<details>
<summary>1. Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side credit analyst and d…</summary>

`````text
Prompt for Balance Sheet analysis

Company: Datadog, DDOG

# ROLE

Act as a senior buy-side credit analyst and distressed-debt specialist. Your expertise is assessing financial solvency, capital structure efficiency, and hidden risks. Your task is to perform a forensic analysis of the Balance Sheet in order to determine the company's financial resilience.
Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the company's Balance Sheet to answer: "Is this company a financial fortress, or is it structurally fragile?"

# INSTRUCTIONAL FLOW

# 1. Sourcing and data (MANDATORY)

Primary source: Find the most recent 10-K or 10-Q filing via SEC EDGAR.

Requirement: Provide a direct link to the document used.

# 2. Liquidity and cash dynamics

Cash trend: Is the cash balance growing?

Ratios: Current Ratio and Quick Ratio.

Working capital: Is cash getting "stuck" in receivables or inventories?

# 3. Architecture, cost and leverage

Debt/Equity (D/E) Ratio:

Compute the current Debt/Equity ratio.

Compare it to the prior year. Is the company becoming more debt-dependent?

Explain which dominates the capital structure: equity or debt.

Debt dynamics: Has debt been rising in recent years? Is it growing faster than EBITDA?

Cost of debt: Estimate the average interest rate (Interest Expense / Total Debt).

Maturity schedule: When will the company need to refinance the bulk of its debt?

# 4. Industry context and benchmarking

D/E context: What is the average Debt/Equity for this industry? (E.g., for capital-heavy sectors like Utilities or Telecoms, high D/E is the norm; for Software it is a warning sign.)

Net Debt/EBITDA: Does the debt level match cash flows in this niche?

# 5. Asset quality and "hidden" risks

Goodwill: What % of assets is "air"? Assess write-down risk.

Tangible Book Value: Compute the real asset value excluding intangibles.

# 6. Financial resilience and bankruptcy risk

Interest Coverage Ratio: How many times does operating profit cover interest?

Altman Z-Score: Assess bankruptcy probability over a 2-year horizon.

Stress test: Would the balance sheet survive a 20% revenue drop?

# 7. Shareholder value and capital discipline

Buybacks vs Debt: Are buybacks being funded by rising debt?

ROIC: Does return on invested capital exceed the cost of borrowing?

# FINAL VERDICT: SOLVENCY ASSESSMENT

Grade the company on the scale:

Financial fortress (Low D/E, plenty of cash, high ROIC).

Stable/Reliable (Moderate D/E, manageable debt).

Levered bet (High D/E but stable cash flow).

Fragile (D/E rising, cash reserves falling).

Distressed (Negative equity or critical debt load).

Why could this balance sheet fail the investor? (Name 3 specific risks.)

# BEHAVIORAL RULES

No hallucinations: If a specific debt maturity date is not disclosed in the filings, write "Not disclosed".

Context above all: Never present a number without explaining whether it is "good" or "bad" for this specific industry.

Citations: Use [Page #] or [Source Link] for every key metric.
`````

</details>

### 2026-07-27 · Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side …

Session: `019fa522-f1ea-7482-a415-fe897b4ed38e` · prompts: 13

<details>
<summary>1. Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side credit analyst and d…</summary>

`````text
Prompt for Balance Sheet analysis

Company: Datadog, DDOG

# ROLE

Act as a senior buy-side credit analyst and distressed-debt specialist. Your expertise is assessing financial solvency, capital structure efficiency, and hidden risks. Your task is to perform a forensic analysis of the Balance Sheet in order to determine the company's financial resilience.
Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the company's Balance Sheet to answer: "Is this company a financial fortress, or is it structurally fragile?"

# INSTRUCTIONAL FLOW

# 1. Sourcing and data (MANDATORY)

Primary source: Find the most recent 10-K or 10-Q filing via SEC EDGAR.

Requirement: Provide a direct link to the document used.

# 2. Liquidity and cash dynamics

Cash trend: Is the cash balance growing?

Ratios: Current Ratio and Quick Ratio.

Working capital: Is cash getting "stuck" in receivables or inventories?

# 3. Architecture, cost and leverage

Debt/Equity (D/E) Ratio:

Compute the current Debt/Equity ratio.

Compare it to the prior year. Is the company becoming more debt-dependent?

Explain which dominates the capital structure: equity or debt.

Debt dynamics: Has debt been rising in recent years? Is it growing faster than EBITDA?

Cost of debt: Estimate the average interest rate (Interest Expense / Total Debt).

Maturity schedule: When will the company need to refinance the bulk of its debt?

# 4. Industry context and benchmarking

D/E context: What is the average Debt/Equity for this industry? (E.g., for capital-heavy sectors like Utilities or Telecoms, high D/E is the norm; for Software it is a warning sign.)

Net Debt/EBITDA: Does the debt level match cash flows in this niche?

# 5. Asset quality and "hidden" risks

Goodwill: What % of assets is "air"? Assess write-down risk.

Tangible Book Value: Compute the real asset value excluding intangibles.

# 6. Financial resilience and bankruptcy risk

Interest Coverage Ratio: How many times does operating profit cover interest?

Altman Z-Score: Assess bankruptcy probability over a 2-year horizon.

Stress test: Would the balance sheet survive a 20% revenue drop?

# 7. Shareholder value and capital discipline

Buybacks vs Debt: Are buybacks being funded by rising debt?

ROIC: Does return on invested capital exceed the cost of borrowing?

# FINAL VERDICT: SOLVENCY ASSESSMENT

Grade the company on the scale:

Financial fortress (Low D/E, plenty of cash, high ROIC).

Stable/Reliable (Moderate D/E, manageable debt).

Levered bet (High D/E but stable cash flow).

Fragile (D/E rising, cash reserves falling).

Distressed (Negative equity or critical debt load).

Why could this balance sheet fail the investor? (Name 3 specific risks.)

# BEHAVIORAL RULES

No hallucinations: If a specific debt maturity date is not disclosed in the filings, write "Not disclosed".

Context above all: Never present a number without explaining whether it is "good" or "bad" for this specific industry.

Citations: Use [Page #] or [Source Link] for every key metric.
`````

</details>

<details>
<summary>2. Поясни цей пункт: Two smaller warning signals merit monitoring: Unbilled receivables increased to **$134 mill…</summary>

`````text
Поясни цей пункт:

Two smaller warning signals merit monitoring:
Unbilled receivables increased to **$134 million**, or roughly 20% of net receivables, from $127 million at year-end.
The credit-loss allowance rose from approximately 2.5% to 3.0% of gross receivables. This is not currently material, but it is a modest deterioration in receivable quality. [Q1 2026 10-Q, Note 6](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm)
`````

</details>

<details>
<summary>3. Estimated DSO was approximately **64 days**, essentially unchanged from Q1 2025.</summary>

`````text
Estimated DSO was approximately **64 days**, essentially unchanged from Q1 2025.
`````

</details>

<details>
<summary>4. що таке TTM?</summary>

`````text
що таке TTM?
`````

</details>

<details>
<summary>5. Поясни цей пункт Debt is not rising persistently. It spiked in 2024 when Datadog issued the 2029 notes while …</summary>

`````text
Поясни цей пункт

Debt is not rising persistently. It spiked in 2024 when Datadog issued the 2029 notes while the 2025 notes remained outstanding, then fell after $634 million of the older notes was settled in 2025.
GAAP EBITDA is too small and volatile to present a flattering gross-leverage ratio: gross debt/TTM GAAP EBITDA is approximately **26.5x**. But that figure ignores $4.76 billion of liquidity. Net debt is negative, so **net debt/EBITDA is not meaningful**—Datadog is a net-cash issuer.
A more useful cash measure is debt/TTM free cash flow of approximately **1.04x**.
`````

</details>

<details>
<summary>6. що таке notes?</summary>

`````text
що таке notes?
`````

</details>

<details>
<summary>7. не зрозумів кому цікаві такі облігації з такими низькими відсотками. хто кредитор?</summary>

`````text
не зрозумів кому цікаві такі облігації з такими низькими відсотками. хто кредитор?
`````

</details>

<details>
<summary>8. тобто це свого роду фючерс чи форвард акції? якось так? тільки датадог вибирає як випалтити - акціями, грошим…</summary>

`````text
тобто це свого роду фючерс чи форвард акції? якось так? тільки датадог вибирає як випалтити - акціями, грошима чи і тим і тим? Чи важливо це мені як інвестору датадог? якщо віддадуть акціями - це мені щось поміняє?
`````

</details>

<details>
<summary>9. це типова історія для sass такі відсотки і такі типи облігацій?</summary>

`````text
це типова історія для sass такі відсотки і такі типи облігацій?
`````

</details>

<details>
<summary>10. Розклади цю аргументацію Its GAAP gross debt/EBITDA appears much worse than the sector benchmark, but that co…</summary>

`````text
Розклади цю аргументацію

Its GAAP gross debt/EBITDA appears much worse than the sector benchmark, but that comparison is distorted by:
Datadog’s unusually large excess-cash position.
Stock compensation depressing GAAP EBITDA.
A zero-coupon convertible note that functions partly as equity-linked financing.
On a net-debt basis, Datadog is materially stronger than the industry benchmark.
`````

</details>

<details>
<summary>11. Поясни цю частину Other asset-quality observations Approximately **$2.38 billion**, or 55% of marketable secu…</summary>

`````text
Поясни цю частину

Other asset-quality observations
Approximately **$2.38 billion**, or 55% of marketable securities, consists of corporate debt rather than U.S. Treasuries.
$2.90 billion of securities matures within one year; $1.43 billion matures in one to five years.
Net unrealized losses were only about $3 million, so there is currently little mark-to-market impairment. [Q1 2026 10-Q, Note 3](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm)
Gross capitalized software costs increased to **$376 million**. Datadog extended the estimated useful life of capitalized software from two to three years in 2025, which slows amortization and modestly benefits current GAAP earnings. This asset is economically less liquid than conventional tangible book value suggests. [2025 10-K, accounting policies](https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm)
`````

</details>

<details>
<summary>12. Поясни це Interest coverage Q1 2026 EBIT coverage: $7.3 million EBIT ÷ $3.1 million interest expense = **2.35…</summary>

`````text
Поясни це

Interest coverage
Q1 2026 EBIT coverage: $7.3 million EBIT ÷ $3.1 million interest expense = **2.35x**.
TTM coverage: negative $24.6 million EBIT ÷ $11.2 million interest expense = **−2.20x**.
On conventional GAAP EBIT, trailing interest is not covered. That would ordinarily be concerning for software debt. Here, the risk is mitigated by the zero cash coupon, substantial interest income and $3.76 billion net-cash position. Q1 interest income and other income of $54.7 million was over 17 times reported interest expense. [Q1 2026 10-Q, statement of operations](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm).
`````

</details>

<details>
<summary>13. Поясни 6. Shareholder value and capital discipline і Final solvency assessment</summary>

`````text
Поясни
6. Shareholder value and capital discipline
і
Final solvency assessment
`````

</details>

### 2026-07-28 · Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side …

Session: `019fa75b-37d3-7873-acd5-c28b0d27412c` · prompts: 15

<details>
<summary>1. Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side credit analyst and d…</summary>

`````text
Prompt for Balance Sheet analysis

Company: Datadog, DDOG

# ROLE

Act as a senior buy-side credit analyst and distressed-debt specialist. Your expertise is assessing financial solvency, capital structure efficiency, and hidden risks. Your task is to perform a forensic analysis of the Balance Sheet in order to determine the company's financial resilience.
Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the company's Balance Sheet to answer: "Is this company a financial fortress, or is it structurally fragile?"

# INSTRUCTIONAL FLOW

# 1. Sourcing and data (MANDATORY)

Primary source: Find the most recent 10-K or 10-Q filing via SEC EDGAR.

Requirement: Provide a direct link to the document used.

# 2. Liquidity and cash dynamics

Cash trend: Is the cash balance growing?

Ratios: Current Ratio and Quick Ratio.

Working capital: Is cash getting "stuck" in receivables or inventories?

# 3. Architecture, cost and leverage

Debt/Equity (D/E) Ratio:

Compute the current Debt/Equity ratio.

Compare it to the prior year. Is the company becoming more debt-dependent?

Explain which dominates the capital structure: equity or debt.

Debt dynamics: Has debt been rising in recent years? Is it growing faster than EBITDA?

Cost of debt: Estimate the average interest rate (Interest Expense / Total Debt).

Maturity schedule: When will the company need to refinance the bulk of its debt?

# 4. Industry context and benchmarking

D/E context: What is the average Debt/Equity for this industry? (E.g., for capital-heavy sectors like Utilities or Telecoms, high D/E is the norm; for Software it is a warning sign.)

Net Debt/EBITDA: Does the debt level match cash flows in this niche?

# 5. Asset quality and "hidden" risks

Goodwill: What % of assets is "air"? Assess write-down risk.

Tangible Book Value: Compute the real asset value excluding intangibles.

# 6. Financial resilience and bankruptcy risk

Interest Coverage Ratio: How many times does operating profit cover interest?

Altman Z-Score: Assess bankruptcy probability over a 2-year horizon.

Stress test: Would the balance sheet survive a 20% revenue drop?

# 7. Shareholder value and capital discipline

Buybacks vs Debt: Are buybacks being funded by rising debt?

ROIC: Does return on invested capital exceed the cost of borrowing?

# FINAL VERDICT: SOLVENCY ASSESSMENT

Grade the company on the scale:

Financial fortress (Low D/E, plenty of cash, high ROIC).

Stable/Reliable (Moderate D/E, manageable debt).

Levered bet (High D/E but stable cash flow).

Fragile (D/E rising, cash reserves falling).

Distressed (Negative equity or critical debt load).

Why could this balance sheet fail the investor? (Name 3 specific risks.)

# BEHAVIORAL RULES

No hallucinations: If a specific debt maturity date is not disclosed in the filings, write "Not disclosed".

Context above all: Never present a number without explaining whether it is "good" or "bad" for this specific industry.

Citations: Use [Page #] or [Source Link] for every key metric.
`````

</details>

<details>
<summary>2. Поясни цей пункт: Two smaller warning signals merit monitoring: Unbilled receivables increased to **$134 mill…</summary>

`````text
Поясни цей пункт:

Two smaller warning signals merit monitoring:
Unbilled receivables increased to **$134 million**, or roughly 20% of net receivables, from $127 million at year-end.
The credit-loss allowance rose from approximately 2.5% to 3.0% of gross receivables. This is not currently material, but it is a modest deterioration in receivable quality. [Q1 2026 10-Q, Note 6](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm)
`````

</details>

<details>
<summary>3. Estimated DSO was approximately **64 days**, essentially unchanged from Q1 2025.</summary>

`````text
Estimated DSO was approximately **64 days**, essentially unchanged from Q1 2025.
`````

</details>

<details>
<summary>4. що таке TTM?</summary>

`````text
що таке TTM?
`````

</details>

<details>
<summary>5. Поясни цей пункт Debt is not rising persistently. It spiked in 2024 when Datadog issued the 2029 notes while …</summary>

`````text
Поясни цей пункт

Debt is not rising persistently. It spiked in 2024 when Datadog issued the 2029 notes while the 2025 notes remained outstanding, then fell after $634 million of the older notes was settled in 2025.
GAAP EBITDA is too small and volatile to present a flattering gross-leverage ratio: gross debt/TTM GAAP EBITDA is approximately **26.5x**. But that figure ignores $4.76 billion of liquidity. Net debt is negative, so **net debt/EBITDA is not meaningful**—Datadog is a net-cash issuer.
A more useful cash measure is debt/TTM free cash flow of approximately **1.04x**.
`````

</details>

<details>
<summary>6. що таке notes?</summary>

`````text
що таке notes?
`````

</details>

<details>
<summary>7. не зрозумів кому цікаві такі облігації з такими низькими відсотками. хто кредитор?</summary>

`````text
не зрозумів кому цікаві такі облігації з такими низькими відсотками. хто кредитор?
`````

</details>

<details>
<summary>8. тобто це свого роду фючерс чи форвард акції? якось так? тільки датадог вибирає як випалтити - акціями, грошим…</summary>

`````text
тобто це свого роду фючерс чи форвард акції? якось так? тільки датадог вибирає як випалтити - акціями, грошима чи і тим і тим? Чи важливо це мені як інвестору датадог? якщо віддадуть акціями - це мені щось поміняє?
`````

</details>

<details>
<summary>9. це типова історія для sass такі відсотки і такі типи облігацій?</summary>

`````text
це типова історія для sass такі відсотки і такі типи облігацій?
`````

</details>

<details>
<summary>10. Розклади цю аргументацію Its GAAP gross debt/EBITDA appears much worse than the sector benchmark, but that co…</summary>

`````text
Розклади цю аргументацію

Its GAAP gross debt/EBITDA appears much worse than the sector benchmark, but that comparison is distorted by:
Datadog’s unusually large excess-cash position.
Stock compensation depressing GAAP EBITDA.
A zero-coupon convertible note that functions partly as equity-linked financing.
On a net-debt basis, Datadog is materially stronger than the industry benchmark.
`````

</details>

<details>
<summary>11. Поясни цю частину Other asset-quality observations Approximately **$2.38 billion**, or 55% of marketable secu…</summary>

`````text
Поясни цю частину

Other asset-quality observations
Approximately **$2.38 billion**, or 55% of marketable securities, consists of corporate debt rather than U.S. Treasuries.
$2.90 billion of securities matures within one year; $1.43 billion matures in one to five years.
Net unrealized losses were only about $3 million, so there is currently little mark-to-market impairment. [Q1 2026 10-Q, Note 3](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm)
Gross capitalized software costs increased to **$376 million**. Datadog extended the estimated useful life of capitalized software from two to three years in 2025, which slows amortization and modestly benefits current GAAP earnings. This asset is economically less liquid than conventional tangible book value suggests. [2025 10-K, accounting policies](https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm)
`````

</details>

<details>
<summary>12. Поясни це Interest coverage Q1 2026 EBIT coverage: $7.3 million EBIT ÷ $3.1 million interest expense = **2.35…</summary>

`````text
Поясни це

Interest coverage
Q1 2026 EBIT coverage: $7.3 million EBIT ÷ $3.1 million interest expense = **2.35x**.
TTM coverage: negative $24.6 million EBIT ÷ $11.2 million interest expense = **−2.20x**.
On conventional GAAP EBIT, trailing interest is not covered. That would ordinarily be concerning for software debt. Here, the risk is mitigated by the zero cash coupon, substantial interest income and $3.76 billion net-cash position. Q1 interest income and other income of $54.7 million was over 17 times reported interest expense. [Q1 2026 10-Q, statement of operations](https://www.sec.gov/Archives/edgar/data/1561550/000162828026032328/ddog-20260331.htm).
`````

</details>

<details>
<summary>13. Поясни 6. Shareholder value and capital discipline і Final solvency assessment</summary>

`````text
Поясни
6. Shareholder value and capital discipline
і
Final solvency assessment
`````

</details>

<details>
<summary>14. Порівняй з цією аналітикою</summary>

Вкладення:

- Forensic-аналіз балансу Datadog (DDOG) Статус — senior credit analyst view · ней…: /Users/tarasvynnychuk/.codex/attachments/fd5de629-df96-456f-ab0b-180ffbfb83c2/pasted-text.txt

`````text
Порівняй з цією аналітикою
`````

</details>

<details>
<summary>15. Ок обєднай свою оригінальну відповідь корисними доповненнями. Використовуй ту ж англійську, до тримуйся тієї …</summary>

`````text
Ок обєднай свою оригінальну відповідь корисними доповненнями. Використовуй ту ж англійську, до тримуйся тієї ж структури що була у промпті і якої ти дотримався у відповіді і збережи як сторінку в ноушн під Datadog
`````

</details>

### 2026-07-28 · Ось що мені потрібно зробити по Datadog: Тому зведи для мене таку таблицю income statemen…

Session: `019fa9b0-0192-7da1-a809-a77fda81c53a` · prompts: 3

<details>
<summary>1. Ось що мені потрібно зробити по Datadog: Тому зведи для мене таку таблицю income statement за 7 років, добав …</summary>

Вкладення:

- codex-clipboard-efcc7e77-e9e7-4cad-bd28-ce533babd7e9.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-efcc7e77-e9e7-4cad-bd28-ce533babd7e9.png
- codex-clipboard-100e9cea-99d1-43e0-8ff8-d7510c4ebcd7.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-100e9cea-99d1-43e0-8ff8-d7510c4ebcd7.png

`````text
Ось що мені потрібно зробити по Datadog:

Тому зведи для мене таку таблицю income statement за 7 років, добав туди EPS, пораховані маржинальності, щоб я міг сам проаналізувати
`````

</details>

<details>
<summary>2. в eps - earnings - це перший рядок? чи це якись із прибутків?</summary>

`````text
в eps - earnings - це перший рядок? чи це якись із прибутків?
`````

</details>

<details>
<summary>3. яке джерело Other income (loss), net за останні роки?</summary>

`````text
яке джерело Other income (loss), net за останні роки?
`````

</details>

### 2026-07-28 · Нагадай механіку як ми рахували non-GAAP operating margin для Datadog

Session: `019fa9b3-d0e7-71e3-b18e-7a2a7463d001` · prompts: 6

<details>
<summary>1. Нагадай механіку як ми рахували non-GAAP operating margin для Datadog</summary>

`````text
Нагадай механіку як ми рахували non-GAAP operating margin для Datadog
`````

</details>

<details>
<summary>2. Яка була механіка розрахунку Non‑GAAP operating income</summary>

`````text
Яка була механіка розрахунку Non‑GAAP operating income
`````

</details>

<details>
<summary>3. А тепер це все дуже детально поясни по кожному пункту - чому</summary>

`````text
А тепер це все дуже детально поясни по кожному пункту - чому
`````

</details>

<details>
<summary>4. а ми не перераховували по нашому цей показник по Demodaran? чи я плутаю з чимось іншим?</summary>

`````text
а ми не перераховували по нашому цей показник по Demodaran? чи я плутаю з чимось іншим?
`````

</details>

<details>
<summary>5. нагадай ще раз non-GAAP operating income - для чого він мав би використовуватись згідно Datadog?</summary>

`````text
нагадай ще раз non-GAAP operating income - для чого він мав би використовуватись згідно Datadog?
`````

</details>

<details>
<summary>6. Виникло питання в процесі проходження відео по P&L звіту. В Datadog вони ще рахують non-GAAP Operating Income…</summary>

`````text
Виникло питання в процесі проходження відео по P&L звіту. В Datadog вони ще рахують non-GAAP Operating Income, який за їх версією "потрібен для внутрішнього планування, forecasting і **порівняння underlying operating performance між періодами**. Не призначений замінювати GAAP operating income або показувати повну економічну вигоду для акціонера." Оскільки вони використовують її для "**порівняння underlying operating performance між періодами**" - чи варто мені в аналізі P&L теж дивитись на цю метрику виключно в динаміці? Чи це щось на рівні investor materials (спроба менеджменту підсвітити щось в кращому світлі)?
`````

</details>

### 2026-07-28 · Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG #…

Session: `019fa9c9-594d-7a22-bc07-dad170e51d49` · prompts: 4

<details>
<summary>1. Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG # ROLE Act as an inst…</summary>

`````text
Prompt for earnings quality analysis (Income Statement Analysis)

Company: Datadog, DDOG

# ROLE

Act as an institutional-grade Equity Research Analyst focused on fundamental analysis. Your goal is to deconstruct the company's Income Statement in order to separate "accounting logic" from "financial reality". Focus not only on the bottom-line profit but on how that profit is formed and whether it is scalable. Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the P&L to answer: "Is this business an efficient and scalable money-making machine with high earnings quality, or is that profit masked by accounting noise and shareholder dilution?"

# INSTRUCTIONAL FLOW

# 1. Data Retrieval

Find the most recent 10-K (annual) or 10-Q (quarterly) filing via SEC EDGAR.

Provide a direct link to the Interactive Viewer for the filing used.

State the analysis period: year-over-year (YoY) or quarter-over-quarter (QoQ).

# 2. Determine the company's life-cycle stage per Aswath Damodaran's methodology and analyze its financial results through that lens. Explain whether growth rate, margin and capital discipline match the current stage of development.

# 3. Revenue Engine analysis

Segment breakdown: Who pays and for what? Identify the key revenue drivers.

Growth quality: Analyze YoY/QoQ dynamics. Is growth driven by price, volume, or product-mix shift?

Concentration risk: Does revenue depend on one product, customer or region?

Stability: Is revenue recurring or cyclical/transactional?

# 4. Margin integrity and Moat indicators

Gross Margin: Compute GM (Gross Profit / Revenue).

Interpret GM as an indicator of product quality and the existence of a competitive advantage (Moat).

If GM is falling, identify the cause: stronger competition or rising COGS?

Operating Margin: Analyze the "heart" of the P&L. Compute Operating Income / Revenue.

Operating Leverage: Is revenue growing faster than operating expenses? Or is the company "buying" growth via excessive marketing?

# 5. Below-the-Line and earnings quality

Noise filtering: Identify interest expense, Other Income, and one-time gains/losses.

Source of profit: Does the company earn from its core business or from "accounting lines" such as asset sales or revaluations?

Tax stability: Check the effective tax rate for stability and one-off effects.

# 6. Shareholder returns: EPS and Dilution

Profit vs Cash: Remember: Profit ≠ Cash.

EPS analysis: Explain why EPS matters more than Net Income for the owner. Compare Basic and Diluted EPS.

Dilution and SBC: Analyze Stock-Based Compensation.

Is the number of shares outstanding growing faster than profit?

Assess whether SBC is a motivational tool or hidden value transfer away from shareholders.

# 7. Red Flags checklist

Evaluate the company against 5 critical signs:

Revenue is rising but Gross Margin is falling (competition/cost issues).

Gross profit rises but operating profit stagnates (opex is eating the business).

Net Income holds only thanks to "other income" (weak core business).

EPS is not growing due to dilution (owners lose share).

Profit does not convert into cash (suspected manipulation → requires Cash Flow check).

# FINAL VERDICT: EARNINGS QUALITY ASSESSMENT

Classify the company:

Elite / Scalable: (High GM, expanding operating leverage, minimal dilution).

Stable: (Predictable margin, profit from the core business).

Low quality: (Profit from "noise", high SBC, falling margin).

Risk zone: (Multiple red flags from the checklist).

Is this "Quality earnings" that scales? (Yes/No and justification in 2 sentences).

# BEHAVIORAL RULES

Accrual logic: Remember that revenues/expenses are recognized when incurred, not when cash moves.

No hallucinations: Use only numbers from the cited 10-K/10-Q filings.

Context analysis: Explain "why" margin changed, not merely state the change.
`````

</details>

<details>
<summary>2. Порівняй з аналітикою:</summary>

Вкладення:

- Datadog (DDOG) — Аналіз якості прибутку (Income Statement Analysis) 1. Джерело д…: /Users/tarasvynnychuk/.codex/attachments/b4d9634c-3486-40d3-afa7-2cee04d8dbe1/pasted-text.txt

`````text
Порівняй з аналітикою:
`````

</details>

<details>
<summary>3. Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишити…</summary>

`````text
Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишитись така ж. Англійською. Збережи в notion під Datadog
`````

</details>

<details>
<summary>4. чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатк…</summary>

`````text
чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатково нашу агрегацію в проекті
`````

</details>

### 2026-07-28 · Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG #…

Session: `019faa79-1fd5-77f2-aee0-4c9c095560e3` · prompts: 4

<details>
<summary>1. Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG # ROLE Act as an inst…</summary>

`````text
Prompt for earnings quality analysis (Income Statement Analysis)

Company: Datadog, DDOG

# ROLE

Act as an institutional-grade Equity Research Analyst focused on fundamental analysis. Your goal is to deconstruct the company's Income Statement in order to separate "accounting logic" from "financial reality". Focus not only on the bottom-line profit but on how that profit is formed and whether it is scalable. Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the P&L to answer: "Is this business an efficient and scalable money-making machine with high earnings quality, or is that profit masked by accounting noise and shareholder dilution?"

# INSTRUCTIONAL FLOW

# 1. Data Retrieval

Find the most recent 10-K (annual) or 10-Q (quarterly) filing via SEC EDGAR.

Provide a direct link to the Interactive Viewer for the filing used.

State the analysis period: year-over-year (YoY) or quarter-over-quarter (QoQ).

# 2. Determine the company's life-cycle stage per Aswath Damodaran's methodology and analyze its financial results through that lens. Explain whether growth rate, margin and capital discipline match the current stage of development.

# 3. Revenue Engine analysis

Segment breakdown: Who pays and for what? Identify the key revenue drivers.

Growth quality: Analyze YoY/QoQ dynamics. Is growth driven by price, volume, or product-mix shift?

Concentration risk: Does revenue depend on one product, customer or region?

Stability: Is revenue recurring or cyclical/transactional?

# 4. Margin integrity and Moat indicators

Gross Margin: Compute GM (Gross Profit / Revenue).

Interpret GM as an indicator of product quality and the existence of a competitive advantage (Moat).

If GM is falling, identify the cause: stronger competition or rising COGS?

Operating Margin: Analyze the "heart" of the P&L. Compute Operating Income / Revenue.

Operating Leverage: Is revenue growing faster than operating expenses? Or is the company "buying" growth via excessive marketing?

# 5. Below-the-Line and earnings quality

Noise filtering: Identify interest expense, Other Income, and one-time gains/losses.

Source of profit: Does the company earn from its core business or from "accounting lines" such as asset sales or revaluations?

Tax stability: Check the effective tax rate for stability and one-off effects.

# 6. Shareholder returns: EPS and Dilution

Profit vs Cash: Remember: Profit ≠ Cash.

EPS analysis: Explain why EPS matters more than Net Income for the owner. Compare Basic and Diluted EPS.

Dilution and SBC: Analyze Stock-Based Compensation.

Is the number of shares outstanding growing faster than profit?

Assess whether SBC is a motivational tool or hidden value transfer away from shareholders.

# 7. Red Flags checklist

Evaluate the company against 5 critical signs:

Revenue is rising but Gross Margin is falling (competition/cost issues).

Gross profit rises but operating profit stagnates (opex is eating the business).

Net Income holds only thanks to "other income" (weak core business).

EPS is not growing due to dilution (owners lose share).

Profit does not convert into cash (suspected manipulation → requires Cash Flow check).

# FINAL VERDICT: EARNINGS QUALITY ASSESSMENT

Classify the company:

Elite / Scalable: (High GM, expanding operating leverage, minimal dilution).

Stable: (Predictable margin, profit from the core business).

Low quality: (Profit from "noise", high SBC, falling margin).

Risk zone: (Multiple red flags from the checklist).

Is this "Quality earnings" that scales? (Yes/No and justification in 2 sentences).

# BEHAVIORAL RULES

Accrual logic: Remember that revenues/expenses are recognized when incurred, not when cash moves.

No hallucinations: Use only numbers from the cited 10-K/10-Q filings.

Context analysis: Explain "why" margin changed, not merely state the change.
`````

</details>

<details>
<summary>2. Порівняй з аналітикою:</summary>

Вкладення:

- Datadog (DDOG) — Аналіз якості прибутку (Income Statement Analysis) 1. Джерело д…: /Users/tarasvynnychuk/.codex/attachments/b4d9634c-3486-40d3-afa7-2cee04d8dbe1/pasted-text.txt

`````text
Порівняй з аналітикою:
`````

</details>

<details>
<summary>3. Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишити…</summary>

`````text
Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишитись така ж. Англійською. Збережи в notion під Datadog
`````

</details>

<details>
<summary>4. чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатк…</summary>

`````text
чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатково нашу агрегацію в проекті
`````

</details>

### 2026-07-28 · Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG #…

Session: `019faa7c-0fba-79e0-be82-fd3328f51076` · prompts: 12

<details>
<summary>1. Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG # ROLE Act as an inst…</summary>

`````text
Prompt for earnings quality analysis (Income Statement Analysis)

Company: Datadog, DDOG

# ROLE

Act as an institutional-grade Equity Research Analyst focused on fundamental analysis. Your goal is to deconstruct the company's Income Statement in order to separate "accounting logic" from "financial reality". Focus not only on the bottom-line profit but on how that profit is formed and whether it is scalable. Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how money actually moves through the business.

# OBJECTIVE

Analyze the P&L to answer: "Is this business an efficient and scalable money-making machine with high earnings quality, or is that profit masked by accounting noise and shareholder dilution?"

# INSTRUCTIONAL FLOW

# 1. Data Retrieval

Find the most recent 10-K (annual) or 10-Q (quarterly) filing via SEC EDGAR.

Provide a direct link to the Interactive Viewer for the filing used.

State the analysis period: year-over-year (YoY) or quarter-over-quarter (QoQ).

# 2. Determine the company's life-cycle stage per Aswath Damodaran's methodology and analyze its financial results through that lens. Explain whether growth rate, margin and capital discipline match the current stage of development.

# 3. Revenue Engine analysis

Segment breakdown: Who pays and for what? Identify the key revenue drivers.

Growth quality: Analyze YoY/QoQ dynamics. Is growth driven by price, volume, or product-mix shift?

Concentration risk: Does revenue depend on one product, customer or region?

Stability: Is revenue recurring or cyclical/transactional?

# 4. Margin integrity and Moat indicators

Gross Margin: Compute GM (Gross Profit / Revenue).

Interpret GM as an indicator of product quality and the existence of a competitive advantage (Moat).

If GM is falling, identify the cause: stronger competition or rising COGS?

Operating Margin: Analyze the "heart" of the P&L. Compute Operating Income / Revenue.

Operating Leverage: Is revenue growing faster than operating expenses? Or is the company "buying" growth via excessive marketing?

# 5. Below-the-Line and earnings quality

Noise filtering: Identify interest expense, Other Income, and one-time gains/losses.

Source of profit: Does the company earn from its core business or from "accounting lines" such as asset sales or revaluations?

Tax stability: Check the effective tax rate for stability and one-off effects.

# 6. Shareholder returns: EPS and Dilution

Profit vs Cash: Remember: Profit ≠ Cash.

EPS analysis: Explain why EPS matters more than Net Income for the owner. Compare Basic and Diluted EPS.

Dilution and SBC: Analyze Stock-Based Compensation.

Is the number of shares outstanding growing faster than profit?

Assess whether SBC is a motivational tool or hidden value transfer away from shareholders.

# 7. Red Flags checklist

Evaluate the company against 5 critical signs:

Revenue is rising but Gross Margin is falling (competition/cost issues).

Gross profit rises but operating profit stagnates (opex is eating the business).

Net Income holds only thanks to "other income" (weak core business).

EPS is not growing due to dilution (owners lose share).

Profit does not convert into cash (suspected manipulation → requires Cash Flow check).

# FINAL VERDICT: EARNINGS QUALITY ASSESSMENT

Classify the company:

Elite / Scalable: (High GM, expanding operating leverage, minimal dilution).

Stable: (Predictable margin, profit from the core business).

Low quality: (Profit from "noise", high SBC, falling margin).

Risk zone: (Multiple red flags from the checklist).

Is this "Quality earnings" that scales? (Yes/No and justification in 2 sentences).

# BEHAVIORAL RULES

Accrual logic: Remember that revenues/expenses are recognized when incurred, not when cash moves.

No hallucinations: Use only numbers from the cited 10-K/10-Q filings.

Context analysis: Explain "why" margin changed, not merely state the change.
`````

</details>

<details>
<summary>2. Порівняй з аналітикою:</summary>

Вкладення:

- Datadog (DDOG) — Аналіз якості прибутку (Income Statement Analysis) 1. Джерело д…: /Users/tarasvynnychuk/.codex/attachments/b4d9634c-3486-40d3-afa7-2cee04d8dbe1/pasted-text.txt

`````text
Порівняй з аналітикою:
`````

</details>

<details>
<summary>3. Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишити…</summary>

`````text
Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишитись така ж. Англійською. Збережи в notion під Datadog
`````

</details>

<details>
<summary>4. чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатк…</summary>

`````text
чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатково нашу агрегацію в проекті
`````

</details>

<details>
<summary>5. не співпадає ця фраза що ти зберіг в notion The annual context is less favorable: FY2025 gross margin fell fr…</summary>

Вкладення:

- codex-clipboard-952c9cdb-1daf-46cf-bde8-62a8a43bfd93.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-952c9cdb-1daf-46cf-bde8-62a8a43bfd93.png

`````text
не співпадає ця фраза що ти зберіг в notion

The annual context is less favorable: FY2025 gross margin fell from 80.8% to 80.0% because cost of revenue grew 33.3%, faster than 27.7% revenue growth. Q1 2026 indicates stabilization, but not yet a reversal of the cumulative annual compression.

з даними що ти мені згенерував в excel
`````

</details>

<details>
<summary>6. However, FY2025 provides an important counterweight: total operating expenses grew 31.7% against revenue grow…</summary>

Вкладення:

- codex-clipboard-0b785b95-b129-48cf-bf5c-1749642d6844.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-0b785b95-b129-48cf-bf5c-1749642d6844.png

`````text
However, FY2025 provides an important counterweight: total operating expenses grew 31.7% against revenue growth of 27.7%,

Я досі не розумію. В екселі інші цифри. чому різниця?
`````

</details>

<details>
<summary>7. тоді ще раз повернемось до фрази "The annual context is less favorable: FY2025 gross margin fell from 80.8% t…</summary>

`````text
тоді ще раз повернемось до фрази "The annual context is less favorable: FY2025 gross margin fell from 80.8% to 80.0% because cost of revenue grew 33.3%, faster than 27.7% revenue growth. " - теж не співпадає з екскель
`````

</details>

<details>
<summary>8. до таке LTM reconciliation</summary>

`````text
до таке LTM reconciliation
`````

</details>

<details>
<summary>9. поясни цю фразу Capitalized software development cash spending rose from $60.8 million to $85.8 million in FY…</summary>

`````text
поясни цю фразу

Capitalized software development cash spending rose from $60.8 million to $85.8 million in FY2025. This does not by itself indicate manipulation, but it is an important monitoring line because capitalization moves current development spending from the income statement into future amortization.
`````

</details>

<details>
<summary>10. а якщо це так - ми враховували це коли рахували operating expenses?</summary>

`````text
а якщо це так - ми враховували це коли рахували operating expenses?
`````

</details>

<details>
<summary>11. тобто компанія може тут маніпулювати? і перенеправляти кожного року чи кварталі різну частку на капіталізацію…</summary>

`````text
тобто компанія може тут маніпулювати? і перенеправляти кожного року чи кварталі різну частку на капіталізацію? щоб наприклад підкручувати якісь показники?
`````

</details>

<details>
<summary>12. чи правильно я розумію, що якщо б запитали в Damodaran то він би сказав що майже все R&D треба амортизувати?</summary>

`````text
чи правильно я розумію, що якщо б запитали в Damodaran то він би сказав що майже все R&D треба амортизувати?
`````

</details>

### 2026-07-29 · підготуй для мене табличку по Datadog в ексель. Щоб я зміг виконати ці завдання

Session: `019faed9-e3e3-7090-88d1-cd4d76b81ac0` · prompts: 7

<details>
<summary>1. підготуй для мене табличку по Datadog в ексель. Щоб я зміг виконати ці завдання</summary>

Вкладення:

- codex-clipboard-d41265e8-a04c-4335-8508-602d3a8eda0b.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-d41265e8-a04c-4335-8508-602d3a8eda0b.png

`````text
підготуй для мене табличку по Datadog в ексель. Щоб я зміг виконати ці завдання
`````

</details>

<details>
<summary>2. Ти включив financing cash flow? В екселі тільки зустрів згадку про investment по рокам.</summary>

Вкладення:

- codex-clipboard-6b39d1e9-92d4-4ade-bbd5-6455d767eeca.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-6b39d1e9-92d4-4ade-bbd5-6455d767eeca.png

`````text
Ти включив financing cash flow?

В екселі тільки зустрів згадку про investment по рокам.
`````

</details>

<details>
<summary>3. а є інфа куди йшов інвестмент? $34,9 $36,0 $58,3 $787,1 ($572,5)</summary>

`````text
а є інфа куди йшов інвестмент?
$34,9	$36,0	$58,3	$787,1	($572,5)
`````

</details>

<details>
<summary>4. поясни кожен пункт financing cash flow</summary>

`````text
поясни кожен пункт financing cash flow
`````

</details>

<details>
<summary>5. на скільки реалістична Капіталізована розробка ПЗ? порівняно з розміром усіх витрати R&D?</summary>

`````text
на скільки реалістична Капіталізована розробка ПЗ? порівняно з розміром усіх витрати R&D?
`````

</details>

<details>
<summary>6. а хіба не правильніше було б списувати значну більшу частку на капіталізацію? По суті швидше всього значно бі…</summary>

`````text
а хіба не правильніше було б списувати значну більшу частку на капіталізацію? По суті швидше всього значно більше було інвестовано в нове ПЗ що буде приносити дохід в майбутньому. Чи ні?
`````

</details>

<details>
<summary>7. а як це Капіталізована SBC?</summary>

`````text
а як це Капіталізована SBC?
`````

</details>

### 2026-07-29 · Prompt for Cash Flow Statement Analysis Company: Datadog, DDOG # ROLE Act as a senior fin…

Session: `019faf12-3cc7-7383-b5a1-7c7f378b2aff` · prompts: 3

<details>
<summary>1. Prompt for Cash Flow Statement Analysis Company: Datadog, DDOG # ROLE Act as a senior financial analyst with …</summary>

`````text
Prompt for Cash Flow Statement Analysis

Company: Datadog, DDOG

# ROLE

Act as a senior financial analyst with forensic audit experience. Your task is to perform a detailed deconstruction of the Cash Flow Statement, based on official filings (10-K/10-Q). Your style must be neutral, descriptive and fact-based. Avoid subjective "buy" or "sell" recommendations. Your goal is to give the investor a transparent picture of how cash actually moves through the business.

# OBJECTIVE

Determine the company's real ability to generate cash, analyze how capital is deployed, and identify discrepancies between accounting profit and real cash flow.

# INSTRUCTIONAL FLOW

1. # Context definition per Damodaran

Based on cash flow dynamics, identify the life-cycle stage (Startup, High Growth, Mature Growth, Maturity, or Decline). Explain which cash-flow characteristics are typical of that stage:

- E.g., for Growth — negative investing cash flow while operating cash flow is rising.
- For Maturity — stable FCF and active capital return.

2. # Operating activities (Cash from Operations - OCF)

- The "Profit to Cash" bridge: Analyze the transition from Net Income to Cash from Operations. Which non-cash items are largest (Depreciation, Stock-Based Compensation)?
- Working Capital: How did changes in receivables, inventories and payables affect cash? Is growth eating up all available cash?
- Quality of earnings: Compare Net Income and OCF. If profit exists but operating cash does not — point out specific causes.

3. # Investing activities (Cash from Investing - ICF)

- Capital expenditures (Capex): How much does the company spend to maintain and develop fixed assets? Compare Capex with Depreciation.
- M&A and assets: Is the company buying other businesses or selling its own assets? Provide amounts and targets (if disclosed).

4. # Financing activities (Cash from Financing - FCFin)

- Debt and equity: Did the company raise new debt or issue shares? Were older obligations repaid?
- Capital return: Record actual dividend payments and share buyback volumes. Compare these outlays with available free cash flow.

5. # Free Cash Flow (FCF)

- Calculate FCF (OCF − Capex).
- Analyze FCF dynamics over the last 4–8 periods.
- Explain exactly where the company directs this flow (debt repayment, cash accumulation or shareholder payouts).

6. # Checklist of facts and "Red Flags" (Factual Red Flags)

Check for the following situations and state them:

1. Operating cash flow (OCF) is systematically lower than Net Income.
2. Shareholder payouts (dividends + buybacks) exceed Free Cash Flow (FCF).
3. The company funds Capex or dividends by raising new debt.
4. Sharp growth in inventories or receivables outpacing revenue growth.

# FINAL VERDICT: CASH REALITY SUMMARY

Provide a concise description of the business's financial reality:

- Source of cash: Where does the cash primarily come from (operations, debt or equity issuance)?
- Use of cash: Where does it go (growth investment, patching balance-sheet holes, or shareholder distributions)?
- Margin of safety: The state of cash balances at period-end and their change.

# BEHAVIORAL RULES

- Objectivity: Do not use phrases like "this is a great investment" or "the company is in trouble". Instead use: "the metrics indicate...", "this is characteristic of the ... stage", "the main factor behind the cash decline was...".
- Precision: Use numbers and reference the report pages [Page #].
- Context: Explain the link between report lines (e.g., how inventory growth affected operating cash flow).
`````

</details>

<details>
<summary>2. порівняй з цією аналітикою:</summary>

Вкладення:

- Аналіз звіту про рух грошових коштів — Datadog (DDOG), FY2025 Джерела: прес-релі…: /Users/tarasvynnychuk/.codex/attachments/3fc332d9-78c3-44c5-a2fc-af6d740ab341/pasted-text.txt

`````text
порівняй з цією аналітикою:
`````

</details>

<details>
<summary>3. добав до свого оригінального звіту ті вкраплення які мають сенс, все англійською, не міняй структури по промп…</summary>

`````text
добав до свого оригінального звіту ті вкраплення які мають сенс, все англійською, не міняй структури по промпту і збережи в ноушн під Datadog
`````

</details>

### 2026-07-29 · що таке PP&E

Session: `019faf5c-3b9a-7cf1-916d-b489cbb57c19` · prompts: 1

<details>
<summary>1. що таке PP&E</summary>

`````text
що таке PP&E
`````

</details>

### 2026-07-29 · Prompt for analyzing "yellow flags" in the financial statements Company: Datadog, DDOG # …

Session: `019fafb3-50b8-70f3-80bb-f7f45627e1ad` · prompts: 2

<details>
<summary>1. Prompt for analyzing "yellow flags" in the financial statements Company: Datadog, DDOG # ROLE Act as a senior…</summary>

`````text
Prompt for analyzing "yellow flags" in the financial statements

Company: Datadog, DDOG

# ROLE

Act as a senior forensic accountant and auditor. Your task is to "stress-test" the company's financial statements for the presence of "yellow flags" (warning signals).

# OBJECTIVE

Identify and document factual anomalies across the three financial statements. State the facts (numbers) and explain them, without offering subjective investment theses. Conclusions about investment risk are left to the investor.

# INSTRUCTIONAL FLOW

1. Sourcing
Use the most recent 10-K or 10-Q filing from SEC EDGAR. Provide a direct link to the document used.

2. Balance Sheet Yellow Flags
Check and state whether the following signs are present:

- Cash vs Debt: Is the cash and equivalents balance smaller than the company's total debt?
- Receivables: Are receivables growing faster than revenue?
- Inventory: Are inventories growing faster than profit?
- Goodwill: Does goodwill exceed 50% of total assets?
- Intangibles: Do intangible assets exceed 50% of total assets?

# Debt load

Does the sum of short-term and long-term debt exceed cash on the balance sheet?

# Preferred stock

Is there preferred stock on the balance sheet?

# Equity

Are retained earnings negative?

# 3. Income Statement Yellow Flags

Analyze the dynamics and structure of revenue and earnings:

- Growth rate: Was there a sudden sharp slowdown in revenue growth?
- Gross Margin: Is there a downward trend in Gross Margin?
- Marketing: Are marketing expenses growing faster than revenue?
- Assets: Was there a recent Goodwill Writedown?
- Dilution: Is shareholder dilution excessively high (shares outstanding)?
- Taxes: Is the effective tax rate persistently lower than the statutory corporate rate in the country of registration?

# 4. Cash Flow Yellow Flags

Compare accounting figures with real cash movement:

- Earnings quality: Is Operating Cash Flow (OCF) lower than Net Income?
- SBC: Does Stock-Based Compensation exceed 10% of Net Income?
- FCF: Is Free Cash Flow lower than Net Income?

# CapEx: Do capital expenditures exceed 25% of Net Income?

# Issuance: Is there excessive issuance of debt or shares?

# Cash trajectory: Is the total cash balance declining during the reporting period?

# 5. Other audit risks (Other Flags)

# Auditor: Was there a sudden change of auditor or an adverse audit opinion?

# Management: Were there sudden departures of top managers?

# Expenses: Are "extraordinary" one-time expenses too frequent and too large?

For each point where a "yellow flag" is detected, respond in the format:

- Indicator: Name of the flag and the number from the report.
- Fact: What exactly happened (e.g., "Goodwill accounts for 62% of assets").
- Mechanics: Why it counts as a warning signal (e.g., "High risk of future write-downs that will reduce equity").

Neutrality: Avoid words like "terrible", "bad", "buy". Use: "a discrepancy was detected", "the trend indicates...", "exceeds the 50% threshold". Precision: Every number must be accompanied by a page reference or section of the report.
`````

</details>

<details>
<summary>2. Збережи як окрему пейджу під Datadog в notion</summary>

`````text
Збережи як окрему пейджу під Datadog в notion
`````

</details>

### 2026-07-30 · що там по фейсбук? чому впав на 10%

Session: `019fb1ea-78b9-72f2-8c02-4ec57574c5a0` · prompts: 1

<details>
<summary>1. що там по фейсбук? чому впав на 10%</summary>

`````text
що там по фейсбук? чому впав на 10%
`````

</details>

### 2026-07-30 · поясни дуже детально ROE, ROCE, ROIC, WACC

Session: `019fb3ca-aae5-7ea2-a1ad-cd27392f8343` · prompts: 5

<details>
<summary>1. поясни дуже детально ROE, ROCE, ROIC, WACC</summary>

`````text
поясни дуже детально ROE, ROCE, ROIC, WACC
`````

</details>

<details>
<summary>2. Як найкраще підійти до розрахунку Capital Employed для Datadog?</summary>

`````text
Як найкраще підійти до розрахунку Capital Employed для Datadog?
`````

</details>

<details>
<summary>3. Порахуй в динаміці для Datadog в ексель</summary>

`````text
Порахуй в динаміці для Datadog в ексель
`````

</details>

<details>
<summary>4. а чому немає ROIC?</summary>

`````text
а чому немає ROIC?
`````

</details>

<details>
<summary>5. давай добавимо з припущеннями</summary>

`````text
давай добавимо з припущеннями
`````

</details>

### 2026-07-31 · Мені треба розкласти маржинальність Datadog по продуктам або напрямам бізнесу в динаміці.…

Session: `019fb6d6-689d-7ac2-9da9-ae65db531617` · prompts: 7

<details>
<summary>1. Мені треба розкласти маржинальність Datadog по продуктам або напрямам бізнесу в динаміці. Збери усі дані для …</summary>

`````text
Мені треба розкласти маржинальність Datadog по продуктам або напрямам бізнесу в динаміці. Збери усі дані для того, щоб зробити таку аналітику. Обовʼязково перевіряй джерело даних і якимось чином це фіксуй.
`````

</details>

<details>
<summary>2. Зроби на сайті окерму вкладку по KPI, виведи туди усі наші показники в динаміці. Які у нас головні KPI по Dat…</summary>

Вкладення:

- codex-clipboard-627f5b8f-ef5c-4e84-b5e8-cc747ce3e6c5.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-627f5b8f-ef5c-4e84-b5e8-cc747ce3e6c5.png

`````text
Зроби на сайті окерму вкладку по KPI, виведи туди усі наші показники в динаміці. Які у нас головні KPI по Datadog? Обовʼязково додай цей графік з product adoption що ти збацав у ексельці. Не забудь біля кожного KPI залишити джерело
`````

</details>

<details>
<summary>3. serve locally so I can preview it</summary>

`````text
serve locally so I can preview it
`````

</details>

<details>
<summary>4. чи є сенс добавити gross retention та NRR в динаміці? І взагалі які ти бачиш головні нефінансові KPI?</summary>

`````text
чи є сенс добавити gross retention та NRR в динаміці? І взагалі які ти бачиш головні нефінансові KPI?
`````

</details>

<details>
<summary>5. OK тоді створи нову вкладку для фінансового аналізу - і перенеси туди revenue та margin що зараз під KPI, до …</summary>

`````text
OK тоді створи нову вкладку для фінансового аналізу - і перенеси туди revenue та margin що зараз під KPI, до KPI добав те, що було щойно згадано і не зафіксовано. Не забувай залишати джерела під кожним. В ідеалі щоб було в динаміці і візуалізовано
`````

</details>

<details>
<summary>6. Ми можемо переосмислити секцію Product scale milestones схоже що там Total customers трохи пересікається з ти…</summary>

`````text
Ми можемо переосмислити секцію
Product scale milestones

схоже що там Total customers трохи пересікається з тим, що вже вказано вище. з цієї секції мені було б найбільш цікаво побачити якусь візуалізацію по секторам. в тебе є якій ідеї як це можна було б зробити?
`````

</details>

<details>
<summary>7. ок зроби так</summary>

`````text
ок зроби так
`````

</details>

### 2026-07-31 · Порахуй ці показники по Datadog

Session: `019fb6d8-b888-7551-962f-57a1382c057e` · prompts: 1

<details>
<summary>1. Порахуй ці показники по Datadog</summary>

Вкладення:

- codex-clipboard-ef1a15a9-cebb-4203-877a-672b7fe45d69.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-ef1a15a9-cebb-4203-877a-672b7fe45d69.png

`````text
Порахуй ці показники по Datadog
`````

</details>

### 2026-07-31 · Як порівнювати Datadog з конкурентами і з індустрією? Наприклад мені інтуїтивно хочеться …

Session: `019fb8a9-6c8f-76e0-9846-2a3c56c748d1` · prompts: 9

<details>
<summary>1. Як порівнювати Datadog з конкурентами і з індустрією? Наприклад мені інтуїтивно хочеться порівняти фінансові …</summary>

`````text
Як порівнювати Datadog з конкурентами і з індустрією? Наприклад мені інтуїтивно хочеться порівняти фінансові показники з умовним ServiceNow чи Snowflake, а якісь NRR GRR churn та ін з прямими конкурентами. Важлива твоя думка в цілому в не залежності від моїх додаткових коментарів враховуючи що я ще початківець і не знаю до кінця чи правильно роздумую, оскільки користуюсь поки тільки логікою та інтуіцією
`````

</details>

<details>
<summary>2. що це за 6-10 компаній на твою думку?</summary>

`````text
що це за 6-10 компаній на твою думку?
`````

</details>

<details>
<summary>3. ти ж не взяв Snowflake і ServiceNow тільки через те, що я згадав їх у першому повідомленні?</summary>

`````text
ти ж не взяв Snowflake і ServiceNow тільки через те, що я згадав їх у першому повідомленні?
`````

</details>

<details>
<summary>4. що б ти обрав замість ServiceNow?</summary>

`````text
що б ти обрав замість ServiceNow?
`````

</details>

<details>
<summary>5. Як ти пропонуєш зробити аналітику в розрізі конкурентів? по яким критеріям можемо порівняти по цьому списку і…</summary>

`````text
Як ти пропонуєш зробити аналітику в розрізі конкурентів? по яким критеріям можемо порівняти по цьому списку із 8 компаній?
`````

</details>

<details>
<summary>6. Де тут ми справді зможемо порівнювати яблука з яблуками, а не ябулка з картоплею?</summary>

`````text
Де тут ми справді зможемо порівнювати яблука з яблуками, а не ябулка з картоплею?
`````

</details>

<details>
<summary>7. Що із цього має нюанси? (Наприклад коли ми рахуємо GAAP operating margin, FCF margin, Rule of 40 - факт висок…</summary>

`````text
Що із цього має нюанси? (Наприклад коли ми рахуємо GAAP operating margin, FCF margin, Rule of 40 - факт високого SBC може спотворювати показники і можуть получитсь яблука до картоплі? чи я щось неправильно розумію?)

Revenue growth
NTM growth
Gross margin
GAAP operating margin
FCF margin
Rule of 40
SBC / revenue
Dilution
EV / NTM Revenue
EV / NTM FCF
`````

</details>

<details>
<summary>8. ОК тепер зроби цю аналітку</summary>

`````text
ОК тепер зроби цю аналітку
`````

</details>

<details>
<summary>9. Давай сплануємо нову вкладку на нашому сайті і з тим як візуалізувати цю аналітику</summary>

`````text
Давай сплануємо нову вкладку на нашому сайті і з тим як візуалізувати цю аналітику
`````

</details>

### 2026-08-02 · Datadog майже не розкриває даних щоб порахувати маржинальність по напрямках бізнесу. Це т…

Session: `019fc2ff-5ddf-7431-b679-4fd23ab5feb3` · prompts: 1

<details>
<summary>1. Datadog майже не розкриває даних щоб порахувати маржинальність по напрямках бізнесу. Це типово для індустрії?</summary>

Вкладення:

- codex-clipboard-8f21f4e7-77be-45e4-ab8c-9f192c7b7080.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-8f21f4e7-77be-45e4-ab8c-9f192c7b7080.png

`````text
Datadog майже не розкриває даних щоб порахувати маржинальність по напрямках бізнесу. Це типово для індустрії?
`````

</details>

### 2026-08-02 · Давай ще раз пройдемося по збереженому в notion висновками по Datadog. Очевидно що OCF та…

Session: `019fc403-e445-7320-abe7-1cd31a50c505` · prompts: 3

<details>
<summary>1. Давай ще раз пройдемося по збереженому в notion висновками по Datadog. Очевидно що OCF та FCF дуже сильно зал…</summary>

Вкладення:

- codex-clipboard-e7f79686-6065-4de1-8559-cddba0a20d1b.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-e7f79686-6065-4de1-8559-cddba0a20d1b.png

`````text
Давай ще раз пройдемося по збереженому в notion висновками по Datadog. Очевидно що OCF та FCF дуже сильно залежать від SBC. Чи є можливість якось порахувати FCF більш точніше? використовуючи методику Demodaran наприклад? чи в цьому немає сенсу? важлво чи правильніша методика дозволила б правильно оцінити динаміку?
`````

</details>

<details>
<summary>2. | Рік | Reported FCF | Total SBC | Owner FCF після SBC | Reported margin | Owner margin | |---:|---:|---:|---…</summary>

`````text
| Рік | Reported FCF | Total SBC | Owner FCF після SBC | Reported margin | Owner margin |
|---:|---:|---:|---:|---:|---:|
| 2021 | 250.5 | 173.4 | 77.1 | 24.3% | 7.5% |
| 2022 | 353.5 | 378.0 | −24.5 | 21.1% | −1.5% |
| 2023 | 597.5 | 495.9 | 101.6 | 28.1% | 4.8% |
| 2024 | 775.1 | 583.5 | 191.6 | 28.9% | 7.1% |
| 2025 | 914.7 | 774.1 | 140.6 | 26.7% | 4.1% |


Давай візуалізуємо це у financial частині нашого сайту
`````

</details>

<details>
<summary>3. serve locally</summary>

`````text
serve locally
`````

</details>

### 2026-08-02 · давай сплануємо що найважливіше додати до фінансової вкладки сайту і як візуалізувати?

Session: `019fc414-f96e-7ab3-9be4-d8e817ac4d25` · prompts: 2

<details>
<summary>1. давай сплануємо що найважливіше додати до фінансової вкладки сайту і як візуалізувати?</summary>

Вкладення:

- codex-clipboard-5a671c5b-16a0-4d9c-b3fb-1e0cfcd86059.png — /var/folders/tt/77v1gqw90fv6mvz2vp7f4zlr0000gn/T/codex-clipboard-5a671c5b-16a0-4d9c-b3fb-1e0cfcd86059.png

`````text
давай сплануємо що найважливіше додати до фінансової вкладки сайту і як візуалізувати?
`````

</details>

<details>
<summary>2. Імплементуй. ТІльки спочатку зверни увагу на те, що зараз уже є під влкадкою фінансів (були незначні додатки)…</summary>

`````text
Імплементуй. ТІльки спочатку зверни увагу на те, що зараз уже є під влкадкою фінансів (були незначні додатки).

Також добав пояснення у вигляді тултіпів або коротких записок по методологіям та або коротким висновкам
`````

</details>

### 2026-08-02 · В інвестиційному курсі попереднього разу був коментар одного із авторів. Допоможи сформул…

Session: `019fc42c-3d47-7773-9221-9c12b84a3537` · prompts: 2

<details>
<summary>1. В інвестиційному курсі попереднього разу був коментар одного із авторів. Допоможи сформулювати це питання біл…</summary>

`````text
В інвестиційному курсі попереднього разу був коментар одного із авторів. Допоможи сформулювати це питання більш стисло.


Цитата з попереднього лайву від Саші на тему на скільки варто заглиблюватись в аналізі компаній: “Щодо кількості аналізу, мені згадався Демодаран, відомий чувак, який дуже шарить valuation-і, в оцінці вартості. Він, по суті, та людина, яка дуже багато обирає метрики при оцінці компаній і дуже глибоко копає в оцінці. І часто він дає дуже песимістичні прогнози через те, що так сильно викопує. Відповідно, на це це теж можна накласти. Тобто, чим глибше ви будете копати, тим більше буде вилазити якихось негативних моментів. І з одного боку, це добре, тому що воно вас може вберегти від втрат, але з іншого боку, занадто глибокий аналіз і занадто deep dive може зробити таку ситуацію, що ви просто не зможете нічого купувати. Тому треба якраз оптимум, і навіть якщо ось ці AI промпти ви будете використовувати, то це вже дуже добре.”.  Питання - як знайти цей оптимум? І на скільки ви керуєтесь принципами в evaluation Demodaranа? З вашої практики - на скільки його кіневі вельюейшени були занижені порівняно з тим, що є насправді (якщо це звісно можливо оцінити)?
`````

</details>

<details>
<summary>2. Згадай що це було згадано на попердньому стрімі - короткий контекст я би все-таки добавив</summary>

`````text
Згадай що це було згадано на попердньому стрімі - короткий контекст я би все-таки добавив
`````

</details>

### 2026-08-02 · Я хочу пройтись ще раз по теорії фін аналізу. від доходу до чистого прибутку, роль SBC, O…

Session: `019fc44e-f84f-7fa0-8668-3908c79a3eeb` · prompts: 1

<details>
<summary>1. Я хочу пройтись ще раз по теорії фін аналізу. від доходу до чистого прибутку, роль SBC, OCF, FCF, усі види ма…</summary>

`````text
Я хочу пройтись ще раз по теорії фін аналізу. від доходу до чистого прибутку, роль SBC, OCF, FCF, усі види маржинальності, роль R&D та Capex - як їх перераховують. Передивись усі чати під цим проектом. Я хочу для себе якесь зведення по теорії, до якого я зможу повертатись. Я багато що забув тут згадати по фін аналізу - добав усе що я не вказав теж. Збери усі промпти які я використав - вони мають бути базою теж
`````

</details>

## Повторно використані промпти

- **4×** — Prompt: Deep Business Model Analysis (Forensic Business Model Analysis) Company: Datadog, DDOG # ROLE Act as a senior investment analyst and strategy consultan…
  - Використано: `2026-07-24/019f953a-f417-7bb3-a65a-0688b652531e`, `2026-07-25/019f993c-6993-7bd2-8e5a-bd6a9815d45b`, `2026-07-25/019f9967-f528-7b60-b9b1-2097cc7faeb6`, `2026-07-25/019f9981-f5c4-7ac2-8314-bf7a8499b4a4`
- **3×** — Давай одразу по показникам розберемось. Частково ця тема зачипалась в аналізі moat (подивись збережену сторінку в notion).
  - Використано: `2026-07-25/019f993c-6993-7bd2-8e5a-bd6a9815d45b`, `2026-07-25/019f9967-f528-7b60-b9b1-2097cc7faeb6`, `2026-07-25/019f9981-f5c4-7ac2-8314-bf7a8499b4a4`
- **3×** — Не варто механічно віднімати всю SBC від FCF — ці величини мають різні правила визнання. Але й трактувати весь $915 млн як повністю доступний акціонерам cash e…
  - Використано: `2026-07-25/019f993c-6993-7bd2-8e5a-bd6a9815d45b`, `2026-07-25/019f9967-f528-7b60-b9b1-2097cc7faeb6`, `2026-07-25/019f9981-f5c4-7ac2-8314-bf7a8499b4a4`
- **3×** — AI prompt for management and CEO analysis Company: Datadog, DDOG CEO: Alexis Lê‑Quôc and Olivier Pomel # ROLE Act as a Senior Equity Analyst and Corporate Gove…
  - Використано: `2026-07-26/019f9e69-2561-7110-8965-af1a51062a12`, `2026-07-26/019f9f28-af48-7831-8d6e-3f88e2d071da`, `2026-07-26/019f9f2b-3f0c-7d83-85ad-a3e2397baf00`
- **3×** — Prompt for Balance Sheet analysis Company: Datadog, DDOG # ROLE Act as a senior buy-side credit analyst and distressed-debt specialist. Your expertise is asses…
  - Використано: `2026-07-27/019fa4d4-8dd4-7f90-8f2d-918aa3cc2d8b`, `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **3×** — Prompt for earnings quality analysis (Income Statement Analysis) Company: Datadog, DDOG # ROLE Act as an institutional-grade Equity Research Analyst focused on…
  - Використано: `2026-07-28/019fa9c9-594d-7a22-bc07-dad170e51d49`, `2026-07-28/019faa79-1fd5-77f2-aee0-4c9c095560e3`, `2026-07-28/019faa7c-0fba-79e0-be82-fd3328f51076`
- **3×** — Порівняй з аналітикою:
  - Використано: `2026-07-28/019fa9c9-594d-7a22-bc07-dad170e51d49`, `2026-07-28/019faa79-1fd5-77f2-aee0-4c9c095560e3`, `2026-07-28/019faa7c-0fba-79e0-be82-fd3328f51076`
- **3×** — Ок. тоді додай тільки те, що варто додати до свого оригінального аналізу англійською - структура має залишитись така ж. Англійською. Збережи в notion під Datad…
  - Використано: `2026-07-28/019fa9c9-594d-7a22-bc07-dad170e51d49`, `2026-07-28/019faa79-1fd5-77f2-aee0-4c9c095560e3`, `2026-07-28/019faa7c-0fba-79e0-be82-fd3328f51076`
- **3×** — чи є якісь натяки хоч по розбивці скільки у відсотках приходть доходу від яких напрямів? Можеш глянути додатково нашу агрегацію в проекті
  - Використано: `2026-07-28/019fa9c9-594d-7a22-bc07-dad170e51d49`, `2026-07-28/019faa79-1fd5-77f2-aee0-4c9c095560e3`, `2026-07-28/019faa7c-0fba-79e0-be82-fd3328f51076`
- **2×** — commit and push
  - Використано: `2026-07-22/019f8b1d-011c-78f2-9108-51e77eeeb1c9`, `2026-07-26/019f9e3d-2f31-7cc2-a36d-279120695938`
- **2×** — commit-ammend and push
  - Використано: `2026-07-22/019f8b1d-011c-78f2-9108-51e77eeeb1c9`, `2026-07-22/019f8b1d-011c-78f2-9108-51e77eeeb1c9`
- **2×** — давай
  - Використано: `2026-07-23/019f90af-730a-7e90-9728-f8c3bfd05642`, `2026-07-23/019f90af-730a-7e90-9728-f8c3bfd05642`
- **2×** — так
  - Використано: `2026-07-23/019f90af-730a-7e90-9728-f8c3bfd05642`, `2026-07-23/019f90af-730a-7e90-9728-f8c3bfd05642`
- **2×** — Поясни детально змішану subscription/usage модель Datadog
  - Використано: `2026-07-25/019f9967-f528-7b60-b9b1-2097cc7faeb6`, `2026-07-25/019f9981-f5c4-7ac2-8314-bf7a8499b4a4`
- **2×** — Поясни цю фразу **FCF overstates owner economics.** SBC is added back to operating cash flow while shareholders bear dilution. FY2025 also reported $108 millio…
  - Використано: `2026-07-25/019f9967-f528-7b60-b9b1-2097cc7faeb6`, `2026-07-25/019f9981-f5c4-7ac2-8314-bf7a8499b4a4`
- **2×** — Я хочу оцінити менеджмент сам за критеріями: послідовність, чесність, результативність. Для цього хочу перечитати транскрипти earnings calls. Які пропонуєш взя…
  - Використано: `2026-07-26/019f9e3d-2f31-7cc2-a36d-279120695938`, `2026-07-26/019f9e3f-35e1-7f83-8399-c201b7fb7dcc`
- **2×** — Поясни цей пункт: Two smaller warning signals merit monitoring: Unbilled receivables increased to **$134 million**, or roughly 20% of net receivables, from $12…
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Estimated DSO was approximately **64 days**, essentially unchanged from Q1 2025.
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — що таке TTM?
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Поясни цей пункт Debt is not rising persistently. It spiked in 2024 when Datadog issued the 2029 notes while the 2025 notes remained outstanding, then fell aft…
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — що таке notes?
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — не зрозумів кому цікаві такі облігації з такими низькими відсотками. хто кредитор?
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — тобто це свого роду фючерс чи форвард акції? якось так? тільки датадог вибирає як випалтити - акціями, грошима чи і тим і тим? Чи важливо це мені як інвестору …
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — це типова історія для sass такі відсотки і такі типи облігацій?
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Розклади цю аргументацію Its GAAP gross debt/EBITDA appears much worse than the sector benchmark, but that comparison is distorted by: Datadog’s unusually larg…
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Поясни цю частину Other asset-quality observations Approximately **$2.38 billion**, or 55% of marketable securities, consists of corporate debt rather than U.S…
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Поясни це Interest coverage Q1 2026 EBIT coverage: $7.3 million EBIT ÷ $3.1 million interest expense = **2.35x**. TTM coverage: negative $24.6 million EBIT ÷ $…
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
- **2×** — Поясни 6. Shareholder value and capital discipline і Final solvency assessment
  - Використано: `2026-07-27/019fa522-f1ea-7482-a415-fe897b4ed38e`, `2026-07-28/019fa75b-37d3-7873-acd5-c28b0d27412c`
