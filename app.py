from flask import Flask, render_template, request
from paapi5_python_sdk.api.default_api import DefaultApi
from paapi5_python_sdk.models.partner_type import PartnerType
from paapi5_python_sdk.rest import ApiException
from paapi5_python_sdk.models.search_items_request import SearchItemsRequest
from paapi5_python_sdk.models.search_items_resource import SearchItemsResource
from config import ACCESS_KEY, SECRET_KEY, PARTNER_TAG, HOST, REGION

app = Flask(__name__, template_folder="templates")


default_api = DefaultApi(
    access_key=ACCESS_KEY, secret_key=SECRET_KEY, host=HOST, region=REGION
)

def get_products(query: str, page: int = 1, min_price: float = None, max_price: float = None, sort_by: str = None):
    """Products ko filters ke saath fetch karte hain."""
    try:
        products = []
        max_attempts = 5
        attempts = 0

        while len(products) < 10 and attempts < max_attempts:
            search_items_request = SearchItemsRequest(
                partner_tag=PARTNER_TAG,
                partner_type=PartnerType.ASSOCIATES,
                keywords=query,
                item_count=10,  
                item_page=page,
                resources=[
                    SearchItemsResource.ITEMINFO_TITLE,
                    SearchItemsResource.OFFERS_LISTINGS_PRICE,
                    SearchItemsResource.IMAGES_PRIMARY_LARGE,
                ]
            )

            response = default_api.search_items(search_items_request)

            if response.search_result and response.search_result.items:
                for item in response.search_result.items:
                    if len(products) >= 10:
                        break  

                    try:
                        title = item.item_info.title.display_value if item.item_info and item.item_info.title else "Unknown Title"
                        price = item.offers.listings[0].price.amount if item.offers and item.offers.listings else None
                        price_display = item.offers.listings[0].price.display_amount if price else "Price Not Available"
                        image = item.images.primary.large.url if item.images and item.images.primary else "No Image Available"
                        url = item.detail_page_url if item.detail_page_url else "URL Not Available"

                        if (min_price and price and price < min_price) or (max_price and price and price > max_price):
                            continue

                        products.append({"title": title, "price": price_display, "image": image, "url": url, "raw_price": price})

                    except Exception:
                        continue  

            if len(products) < 10:
                page += 1  
            attempts += 1  

        if sort_by == "price_low_high":
            products.sort(key=lambda x: x["raw_price"] if x["raw_price"] else float("inf"))
        elif sort_by == "price_high_low":
            products.sort(key=lambda x: x["raw_price"] if x["raw_price"] else 0, reverse=True)

        return products

    except ApiException as e:
        return {"error": f"Amazon API Error: {e.body}"}
    except Exception as e:
        return {"error": str(e)}

@app.route("/", methods=["GET"])
def index():
    query = request.args.get("query", "")  
    page = request.args.get("page", default=1, type=int)  
    min_price = request.args.get("min_price", default=100, type=float)  
    max_price = request.args.get("max_price", default=100000, type=float)  
    sort_by = request.args.get("sort_by", default=None)  

    products = get_products(query, page, min_price, max_price, sort_by) if query else []  

    return render_template(
        "main.html", 
        products=products, 
        query=query, 
        page=page,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by
    )

if __name__ == '__main__':
    # Instead of using ngrok, we'll make Flask listen on all network interfaces
    # This will make your app accessible from other devices on your local network
    print(" * Running Flask app on your local network")
    print(" * Other devices can access it using your computer's IP address")
    print(" * For example: http://<your-ip-address>:5000")
    
    # Start the Flask app and make it accessible on your local network
    app.run(debug=True, host='0.0.0.0', port=5000)