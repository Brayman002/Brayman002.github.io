```javascript
export default {

    async fetch(request) {

        const requestURL = new URL(request.url);

        const imageURL =
            requestURL.searchParams.get("image");

        const redirectURL =
            requestURL.searchParams.get("redirect");


        /*
         * ==========================================
         * VALIDATE PARAMETERS
         * ==========================================
         */

        if (!imageURL || !redirectURL) {

            return new Response(
                "Missing image or redirect parameter.",
                {
                    status: 400,
                    headers: {
                        "content-type": "text/plain; charset=UTF-8"
                    }
                }
            );
        }


        let image;
        let redirect;


        try {

            image = new URL(imageURL);
            redirect = new URL(redirectURL);

        } catch {

            return new Response(
                "Invalid URL.",
                {
                    status: 400,
                    headers: {
                        "content-type": "text/plain; charset=UTF-8"
                    }
                }
            );
        }


        /*
         * Only allow normal web URLs.
         */

        if (
            image.protocol !== "http:" &&
            image.protocol !== "https:"
        ) {

            return new Response(
                "Invalid image URL.",
                {
                    status: 400
                }
            );
        }


        if (
            redirect.protocol !== "http:" &&
            redirect.protocol !== "https:"
        ) {

            return new Response(
                "Invalid redirect URL.",
                {
                    status: 400
                }
            );
        }


        /*
         * ==========================================
         * ESCAPE VALUES FOR HTML
         * ==========================================
         */

        const escapeHTML = (value) => {

            return value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };


        const safeImage =
            escapeHTML(image.href);


        const safeRedirect =
            escapeHTML(redirect.href);


        /*
         * ==========================================
         * DISCORD EMBED PAGE
         * ==========================================
         */

        const html = `<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Image</title>


    <!-- Discord -->

    <meta
        property="og:type"
        content="website"
    >

    <meta
        property="og:title"
        content="Image"
    >

    <meta
        property="og:image"
        content="${safeImage}"
    >

    <meta
        property="og:image:secure_url"
        content="${safeImage}"
    >

    <meta
        property="og:url"
        content="${escapeHTML(request.url)}"
    >


    <!-- Twitter / other crawlers -->

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:image"
        content="${safeImage}"
    >


    <!-- Redirect normal browsers -->

    <meta
        http-equiv="refresh"
        content="0;url=${safeRedirect}"
    >

    <script>

        window.location.replace(
            ${JSON.stringify(redirect.href)}
        );

    </script>

</head>


<body>

    <!--
        Nothing is displayed here.

        Discord reads og:image.

        Normal visitors are immediately redirected.
    -->

</body>

</html>`;


        /*
         * ==========================================
         * RETURN HTML
         * ==========================================
         */

        return new Response(
            html,
            {
                status: 200,

                headers: {

                    "content-type":
                        "text/html; charset=UTF-8",

                    "cache-control":
                        "public, max-age=300",

                    "x-content-type-options":
                        "nosniff"

                }
            }
        );
    }
};
```
