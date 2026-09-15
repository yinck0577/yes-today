---
title: 'Nvidia、Palantir收緊AI使用！公司資料可以貼ChatGPT、Claude嗎？7類機密紅線一次看'
description: 'Nvidia、Palantir與Booz Allen據報收緊部分Anthropic模型使用。公司文件、原始碼與客戶資料能否貼進ChatGPT、Claude？一次看懂7類機密紅線、模型訓練、資料保存與ZDR差異。'
pubDate: 'Sep 16 2026 09:00:00'
heroImage: '/enterprise-ai-data-security-chatgpt-claude-20260916.png'
category: 'tech'
featured: true
---

生成式AI已經進入企業日常，但最積極使用AI的科技公司，也開始重新檢視敏感資料該交給哪些模型處理。

路透社9月14日引述《The Information》報導，Nvidia、Palantir及美國顧問公司Booz Allen Hamilton近期都針對Anthropic模型採取更嚴格的使用限制。據報導，Palantir要求Anthropic提供不可撤回的零資料保留（Zero Data Retention，ZDR）承諾；Nvidia將Anthropic模型限制於較不敏感的工作；Booz Allen則禁止員工使用Anthropic商業AI處理專有資安工作。

需要注意的是，上述措施來自《The Information》報導並由路透社轉述，**不等於3家公司已公開完整AI內規**。

爭議核心也不只是「AI會不會拿公司資料訓練」，而是企業資料輸入外部AI後，會不會被保存、保存多久、送往哪一家供應商，以及誰可能存取。

對一般上班族而言，問題也很直接：**公司文件、原始碼、客戶Excel到底能不能貼進ChatGPT、Claude？**

答案不能只看AI工具本身，還要確認公司政策、使用的帳號類型、資料敏感程度，以及企業是否有權將這份資料交給外部AI處理。

## Nvidia、Palantir為何限制Claude？

這波企業AI管控受到注意，與Anthropic今年調整部分高能力模型的資料保留政策有關。

但首先要釐清：

> **不是所有Claude模型，也不是所有Claude企業客戶，都一律改成至少30天資料留存。**

Anthropic自2026年6月9日起，針對被指定為「Covered Models」的高能力模型採取額外安全措施，影響部分原先採用Zero Data Retention的企業使用情境。

其他未被列為Covered Models的模型，仍依原有合約與Retention設定處理。

根據《The Information》、路透社轉述，目前3家公司被報導採取的措施如下：

| 公司 | 媒體報導的措施 |
|---|---|
| **Nvidia** | 據報將Anthropic模型限制於較不敏感的工作 |
| **Palantir** | 據報要求Anthropic提供不可撤回的ZDR承諾 |
| **Booz Allen** | 據報禁止使用Anthropic商業AI處理專有資安工作 |

這3項都不能進一步延伸成公司的完整AI政策。

以Nvidia為例，目前公開報導沒有完整揭露哪些工作被列為敏感、改用什麼模型或部署環境。

Palantir則是**據報提出ZDR要求**，目前沒有公開資訊證實Anthropic已經接受。

Booz Allen被報導的限制則集中於專有資安工作，也不能寫成「Booz Allen全面禁用Claude」。

## 企業最怕ChatGPT、Claude看到什麼？7類資料先別亂貼

對一般企業而言，真正需要管理的是送進AI的資料。

以下7類資訊尤其需要注意：

| 資料類型 | 常見例子 | 主要風險 |
|---|---|---|
| **商業機密** | 未公開策略、併購案、報價、產品Roadmap | 競爭資訊與保密風險 |
| **原始碼** | 私有程式碼、核心演算法、系統架構 | 智財與資安 |
| **登入憑證與Secrets** | **Password、API Key、Access Token、Private Key、Secret、Connection String** | 帳號或系統可能直接遭存取 |
| **客戶與員工資料** | 姓名、電話、Email、薪資、消費紀錄 | 個資與法遵 |
| **財務與法律資料** | 未公開財報、成本、合約、訴訟策略 | 內控、法律與機密風險 |
| **研發資料** | 晶片設計、配方、專利前技術、測試數據 | 智慧財產 |
| **資安資料** | 未修補漏洞、內部網路架構、驗證機制 | 攻擊面及系統資訊暴露 |

其中Password、API Key、Access Token、Private Key等有效憑證，應與普通原始碼分開看待。

一段公司程式碼是否能交給AI除錯，可能還要依公司政策與程式碼敏感程度判斷；但**有效密碼、金鑰、Token與Secrets應先移除，不應跟著程式碼一起輸入外部AI。**

## 公司原始碼可以貼ChatGPT嗎？

**不能只看ChatGPT或Claude本身，還要看公司政策、帳號類型與程式碼敏感程度。**

公司原始碼可能同時包含：

- 核心演算法
- 私有API
- 內部伺服器資訊
- 資料庫結構
- 客戶資料
- API Key
- Token
- Password
- 尚未公開功能

因此，「只是請AI幫忙Debug」不代表沒有資料風險。

若公司允許特定AI工具協助開發，也應先確認資料使用規範，並移除有效憑證、客戶個資及與除錯無關的敏感資訊。

如果公司明文禁止把內部程式碼輸入外部AI服務，就不能因為使用企業版ChatGPT或Claude自行例外。

## 公司文件可以上傳ChatGPT、Claude嗎？

同樣要看內容。

已公開新聞稿、官網文字和公開產品資料，與未公開財報、董事會簡報、客戶合約的風險完全不同。

可以先用一個簡單問題判斷：

> **這份文件如果今天直接寄給公司外部的人，公司會不會有意見？**

如果答案是「會」，在沒有確認公司政策及AI資料處理條款前，就不適合直接上傳。

尤其包括：

- NDA保密資料
- 客戶提供的文件
- 未公開財報
- 投標資料
- 董事會文件
- 併購資訊
- 員工個資
- 醫療資料
- 訴訟與法律文件

其中部分甚至不是公司的機密，而是公司依法或依契約對第三方負有保密義務的資料。

## ChatGPT會拿公司資料訓練嗎？個人版、企業版不同

不能直接用一句「ChatGPT會拿資料訓練」概括所有產品。

OpenAI目前官方政策指出，ChatGPT Enterprise、ChatGPT Business、ChatGPT Edu及API等商業產品，**預設不使用組織的輸入或輸出內容訓練模型。**

個人ChatGPT則適用不同的資料政策，使用者可透過資料控制設定，選擇不讓新的對話內容用於改善模型。

但企業使用AI時，還要注意一個重要差別：

> **不拿資料訓練，不等於資料完全不保存。**

同樣也不代表：

> **公司因此可以把任何機密資料上傳。**

企業仍須另外確認：

- Retention資料保存期限
- 公司內部AI政策
- 資料所在地
- 權限控管
- 第三方整合
- 法規要求
- NDA及客戶契約

因此，「我們公司用ChatGPT Enterprise，所以任何文件都能丟進去」並不是正確的判斷方式。

## Claude企業資料會保存多久？Covered Models為何引發爭議

Anthropic此次受到企業客戶關注的重點，是**Covered Models**的資料政策。

Anthropic官方說明，自2026年6月9日起，Covered Models的Prompt與模型輸出：

> **至少保留30天。**

如果相關資料涉及安全調查，或依法必須繼續保存，**實際保存期限可能超過30天**。

因此不能把政策簡化成：

> 「Claude資料保留30天後一定刪除。」

比較準確的說法是：

> **Covered Models的Prompt與輸出至少保留30天；若涉及安全調查或法律要求，可能延長保存。**

另外，這項規定針對的是被指定為Covered Models的高能力模型及相關使用情境，**不代表所有Claude模型、所有Claude企業服務都統一採用相同的30天Retention政策。**

[Anthropic｜Covered Models官方說明](https://support.claude.com/en/articles/15425695-covered-models)

## Anthropic完全取消ZDR了嗎？沒有

也不能這樣理解。

Anthropic已公布Enterprise Frontier Safeguards（EFS），預計自2026年秋季起分階段推出，目標是在高能力模型的安全監控要求與企業隱私、資安需求之間建立新的資料治理方式。

官方說明中也列出部分符合資格客戶及過渡安排。

因此，目前較精確的描述是：

> **Covered Models對部分原本採用ZDR的企業使用情境帶來新的資料保留要求，但不等於Anthropic所有企業服務都取消ZDR。**

這也是Palantir據報要求「不可撤回ZDR承諾」的重要背景。

但再次強調，**目前沒有公開資訊證實Anthropic已接受Palantir的要求。**

## 關掉AI訓練，公司資料就可以貼了嗎？

**不行。**

「不拿資料訓練」只解決其中一項問題，並不等於所有資料安全條件都成立。

| 常見理解 | 實際上 |
|---|---|
| 不拿資料訓練 | **≠ 不保存資料** |
| 不保存資料 | **≠ 公司允許上傳** |
| 使用企業版AI | **≠ 所有機密都可以輸入** |
| 移除姓名 | **≠ 一定完成匿名化** |
| 資料有加密 | **≠ 沒有資料外洩風險** |

例如公司可能採用預設不以企業資料訓練模型的服務，但公司內規仍禁止將客戶資料、併購資訊或未公開研發內容交給外部供應商。

所以企業不能只問：

> 「這家公司會不會拿我的資料訓練AI？」

還要看資料保存、存取權限與流向。

## 公司資料貼進ChatGPT、Claude後去哪裡？先看4件事

企業評估AI工具時，可以把資料問題拆成4層：

| 要確認什麼？ | 核心問題 |
|---|---|
| **Training** | 資料是否用於訓練或改善模型？ |
| **Retention** | Prompt、附件與輸出保存多久？ |
| **Access** | 哪些系統、人員或管理者可能存取？ |
| **Data flow** | 資料送到哪個供應商、雲端或處理環境？ |

這4件事不能互相取代。

**不拿資料訓練，不代表資料沒有被保存；資料不長期保存，也不代表企業依法或依契約有權把資料交給第三方AI。**

這也是企業開始重視ZDR的原因。

## 什麼是Zero Data Retention？ZDR為什麼重要？

Zero Data Retention，簡稱**ZDR**，一般可理解為「零資料保留」。

核心概念是企業希望AI供應商完成必要處理後，不持續保留相關Prompt與輸出內容。

如果AI處理的是：

- 尚未公開的晶片設計
- 政府或國防資料
- 未修補的資安漏洞
- 重大併購案
- 核心產品原始碼

資料離開企業自身控制範圍多久，就可能成為採購AI服務時的重要條件。

因此，企業現在關注的已不只是：

> 「AI會不會拿資料訓練？」

也包括：

> 「資料究竟會留下多久？」

## 同樣用AI，資料可能送到不同地方？Palantir MCP就是例子

Palantir自己的官方技術文件提供了一個很具體的例子。

當企業在本機使用Palantir MCP，再串接不同第三方AI工具時，資料流向可能不同：

- **Claude Code：資料送往Anthropic**
- **VS Code Copilot：資料送往Microsoft**
- **其他AI工具：依相應LLM供應商的政策處理**

Palantir也提醒，MCP工具產生的輸出會送往相應的LLM供應商。

因此：

> **同一份企業資料，只因為使用不同AI工具，資料流向就可能改變。**

這也是為什麼公司只封鎖ChatGPT網站，並不能完整解決AI資料治理問題。

員工還可能透過：

- IDE外掛
- AI Agent
- MCP
- 會議AI
- SaaS內建AI
- 程式開發工具

把資料送往其他模型供應商。

[Palantir｜MCP Security官方文件](https://www.palantir.com/docs/foundry/palantir-mcp/security)

## 公司應該全面禁止ChatGPT嗎？AI治理開始重視資料分級

全面禁止外部AI是一種管理方式，但企業也可以依自身法規、資安及工作需求，建立不同的資料使用規則。

一般企業若要建立AI資料分級，可以參考以下簡化框架：

| 資料等級 | 例子 | AI使用原則示例 |
|---|---|---|
| **公開** | 官網、新聞稿、公開資料 | 可依公司核准工具處理 |
| **內部** | SOP、一般內部文件 | 限公司核准AI |
| **機密** | 原始碼、客戶資料、財務資料 | 限企業環境與權限 |
| **高度機密** | 核心IP、未公開技術、國防資料 | 隔離環境、私有部署或禁止送往外部模型 |

這是一般企業治理的簡化示例，**不是Nvidia、Palantir或Booz Allen公開的內部資料分級制度。**

三家公司目前能確認的限制內容，仍應以《The Information》經路透社轉述的報導範圍為準。

## 一般上班族使用ChatGPT、Claude，先確認5件事

如果公司目前沒有完整AI政策，準備把工作內容輸入AI前，可以先確認：

1. **這是不是尚未公開的公司資訊？**
2. **裡面有沒有客戶、員工或其他人的個資？**
3. **有沒有Password、API Key、Token、Private Key等有效憑證？**
4. **公司是否對這份資料負有NDA、法規或其他保密義務？**
5. **如果把完全相同的內容直接寄給外部廠商，公司會不會有意見？**

任何一題答案是「有」，都不適合在沒有確認公司政策前，直接貼進個人AI帳號。

## Nvidia、Palantir限制Claude，代表企業不信任AI嗎？

從目前公開資訊來看，更精確的說法是：企業正在重新評估**模型能力與資料權限之間的界線**。

Nvidia、Palantir與Booz Allen據報採取的措施，都不是全面停止使用生成式AI，而是針對特定模型、資料保存條件或敏感工作調整使用方式。

企業導入AI後，真正要管理的已經不只是員工能不能開ChatGPT，而是**哪些資料能離開公司、可以送到哪個模型、保存多久，以及誰有權限存取。**

對一般上班族而言，最簡單的原則仍是：

> **不要把ChatGPT或Claude的輸入框，當成公司的私人資料夾。**

### 資料來源

[Reuters｜Palantir、Nvidia據報收緊Anthropic模型使用](https://www.reuters.com/business/palantir-nvidia-curb-ai-model-use-over-data-fears-information-reports-2026-09-14/)

[Anthropic｜Covered Models官方說明](https://support.claude.com/en/articles/15425695-covered-models)

[Anthropic｜Covered Models資料保留政策](https://support.claude.com/en/articles/15425996-data-retention-practices-for-covered-models)

[OpenAI｜企業資料隱私、安全與模型訓練政策](https://openai.com/business-data/)

[Palantir｜MCP Security與第三方LLM資料流向](https://www.palantir.com/docs/foundry/palantir-mcp/security)
