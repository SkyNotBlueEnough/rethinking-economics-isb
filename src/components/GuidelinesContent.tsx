import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function GuidelinesContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 text-lg font-semibold">Content & Style</div>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Articles should be accessible to a broad audience, including
              students, professionals, and those with a casual interest in
              economics.
            </li>
            <li>
              Use clear, simple language and explain technical terms where
              necessary.
            </li>
            <li>
              Opinion pieces should be well researched, persuasive, and easy to
              understand.
            </li>
            <li>Blogs can cover topics such as:</li>
            <ul className="list-circle ml-6 list-inside space-y-1">
              <li>Pluralist economic thought</li>
              <li>Political economy and current affairs</li>
              <li>Book reviews from a critical perspective</li>
              <li>Explainers on economic theories and concepts</li>
              <li>Summaries of events and activities</li>
            </ul>
          </ul>
        </div>

        <div>
          <div className="mb-2 text-lg font-semibold">
            Submission Requirements
          </div>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Blog posts should be written formally and range between 350 and
              1,000 words. We accept a variety of styles – including interviews,
              policy critiques, and policy recommendations.
            </li>
            <li>
              Policy papers should be written formally and range between 1,500
              and 2,000 words.
            </li>
            <li>
              Use APA style references. Blogs should include a bibliography and
              may contain hyperlinks throughout if desired.
            </li>
            <li>
              Illustrations (photos, graphics, graphs, cartoons, etc.) must be
              in gif, png, jpg, or jpeg format and submitted with evidence that
              they are free to use (e.g., from a copyright-free website or with
              approval from the owner).
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-2 text-lg font-semibold">How to Submit</div>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Send your article to rethinkingeconomicsislamabad@gmail.com with
              the subject line and file name as:
            </li>
            <ul className="list-circle ml-6 list-inside space-y-1">
              <li>&apos;Blog Submission – [Your Name]&apos; for blog posts.</li>
              <li>
                &apos;Policy Submission – [Your Name]&apos; for policy
                recommendations.
              </li>
            </ul>
            <li>In the email, include your name, degree, and year of study.</li>
            <li>
              Your submission will be reviewed by our editorial team, and if
              necessary, returned with feedback.
            </li>
            <li>
              It is the contributor&apos;s responsibility to review, amend, and
              return the submission accordingly.
            </li>
            <li>
              For any queries, contact our editorial team at
              rethinkingeconomicsislamabad@gmail.com.
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-2 text-lg font-semibold">
            Additional Requirements
          </div>
          <div>
            Abstract: Provide a summary of your article (2-3 sentences). This
            will be posted on our social media to engage readers.
          </div>
        </div>

        <div>
          <div className="mb-2 text-lg font-semibold">Rights & Permissions</div>
          <div>
            Writers retain ownership of their work but grant us the right to
            edit, distribute, and publish the content.
          </div>
        </div>

        <div>
          <div className="mb-2 text-lg font-semibold">
            Example Author Credit
          </div>
          <div>At the end of the article, include a line like:</div>
          <div className="mt-2 italic">
            &quot;This article is written by Bahria University economics student
            Neha Ali.&quot;
          </div>
        </div>

        <div className="mt-6">
          <div>
            We look forward to your contributions! If you have any questions,
            feel free to reach out to us at
            rethinkingeconomicsislamabad@gmail.com.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
